/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import bgDesktopDark from "../assets/images/bg-desktop-dark.jpg";
import bgMobileDark from "../assets/images/bg-mobile-dark.jpg";
import bgDesktopLight from "../assets/images/bg-desktop-light.jpg";
import bgMobileLight from "../assets/images/bg-mobile-light.jpg";
import moon from "../assets/images/icon-moon.svg";
import sun from "../assets/images/icon-sun.svg";
import ListItem from "./ListItem";
import { Droppable, DragDropContext } from "react-beautiful-dnd";

const Main = ({ theme, setTheme }) => {
  const [title, setTitle] = useState("");

  const [list, setList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [active, setActive] = useState("all");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    const existingList = localStorage.getItem("list");
    if (existingList) {
      setList(JSON.parse(existingList));
    }
  }, []);

  useEffect(() => {
    filterListHandler(active);
  }, [list]);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (theme === "dark" && window.innerWidth > 501) {
        setImageUrl(bgDesktopDark);
      } else if (theme === "dark" && window.innerWidth < 500) {
        setImageUrl(bgMobileDark);
      } else if (theme === "light" && window.innerWidth > 501) {
        setImageUrl(bgDesktopLight);
      } else if (theme === "light" && window.innerWidth < 500) {
        setImageUrl(bgMobileLight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const checkHandler = (e, index) => {
    const element = e.currentTarget;
    const paragraphElement = element.nextElementSibling;

    if (element.classList.contains("bg-blue-500")) {
      element.classList.remove("bg-blue-500");
      paragraphElement.classList.remove("line-through");
      paragraphElement.classList.remove("text-light-gray-300");
    } else {
      element.classList.add("bg-blue-500");
      paragraphElement.classList.add("line-through");
      paragraphElement.classList.add("text-light-gray-300");
    }
    const updatedList = [...list];
    updatedList[index].completed = !updatedList[index].completed;
    localStorage.setItem("list", JSON.stringify(updatedList));
    setList(updatedList);
    filterListHandler(active);
  };

  const addToListHandler = () => {
    if (title.trim().length !== 0) {
      const updatedList = [{ title, completed: false }, ...list];
      setList(updatedList);
      filterListHandler(active);
      setTitle("");
      localStorage.setItem("list", JSON.stringify(updatedList));
    }
  };

  const removeItemHandler = (index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setList(updatedList);
    filterListHandler(active);
    localStorage.setItem("list", JSON.stringify(updatedList));
  };

  const filterListHandler = (filter) => {
    let filteredList = [];
    if (filter === "active") {
      filteredList = list.filter((item) => item.completed === false);
      setActive("active");
    } else if (filter === "completed") {
      filteredList = list.filter((item) => item.completed === true);
      setActive("completed");
    } else {
      filteredList = list;
      setActive("all");
    }
    setShowList(filteredList);
  };

  const clearCompletedHandler = () => {
    const updatedList = list.filter((item) => item.completed === false);

    setList(updatedList);
    localStorage.setItem("list", JSON.stringify(updatedList));
  };

  const reorderList = (result) => {
    console.log(result);

    if (result.destination === null) return;

    const newList = Array.from(list);
    // Reorder list:
    const [removed] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, removed);
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
  };

  return (
    <>
      <DragDropContext onDragEnd={reorderList}>
        <div className="font-josefin-sans relative flex min-w-[250px] items-baseline justify-center overflow-auto bg-light-gray-50 pt-[160px] font-medium  dark:bg-dark-gray-50">
          <img
            src={imageUrl}
            alt="background"
            className={`absolute top-0 z-0 h-[350px] object-cover`}
          />
          <div className="card z-10 mb-5 w-4/5 space-y-6 sm:w-[500px] md:w-[600px]">
            <div className="title flex items-center justify-between p-3 text-white">
              <h1 className="space-x-3 text-2xl font-semibold">
                <span>T</span>
                <span>O</span>
                <span>D</span>
                <span>O</span>
              </h1>
              <button className="" onClick={toggleTheme}>
                <img src={theme === "dark" ? sun : moon} alt="mode" />
              </button>
            </div>
            <div className="input flex bg-light-gray-50 text-lg text-light-gray-300 shadow-xl dark:bg-dark-gray-100 dark:text-dark-gray-300">
              <div className="item flex w-full items-center justify-center space-x-3 p-3">
                <h3 className="circle block rounded-full border border-gray-400 p-2"></h3>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToListHandler();
                    }
                  }}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="Create a new todo..."
                  className="w-full bg-light-gray-50 px-2 py-1 text-light-gray-300 focus:outline-none dark:bg-dark-gray-100 dark:text-dark-gray-300"
                />
              </div>
            </div>
            <Droppable droppableId="droppableItem">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className=" list-container rounded-lg bg-light-gray-50 text-lg font-[400] text-light-gray-400 shadow-xl dark:bg-dark-gray-100 dark:text-dark-gray-300">
                  {showList &&
                    showList.map((item, index) => {
                      return (
                        <ListItem
                          key={index}
                          index={index}
                          title={item.title}
                          isCompleted={item.completed}
                          checkHandler={checkHandler}
                          removeItemHandler={removeItemHandler}
                        />
                      );
                    })}

                  <div className="details flex w-full flex-wrap justify-between p-3 font-[400] text-light-gray-300 dark:text-dark-gray-400">
                    <p className="order-1 min-[500px]:basis-auto">
                      {list &&
                        list.filter((ele) => ele.completed === false)
                          .length}{" "}
                      items lefts
                    </p>
                    <ul className="order-3 hidden space-x-3 min-[500px]:order-2 min-[600px]:flex">
                      <li
                        onClick={() => {
                          filterListHandler("all");
                        }}
                        className={`hover:cursor-pointer dark:hover:text-white ${
                          active === "all" ? "text-blue-400" : ""
                        }`}>
                        All
                      </li>
                      <li
                        onClick={() => {
                          filterListHandler("active");
                        }}
                        className={`hover:cursor-pointer dark:hover:text-white ${
                          active === "active" ? "text-blue-400" : ""
                        }`}>
                        Active
                      </li>
                      <li
                        onClick={() => {
                          filterListHandler("completed");
                        }}
                        className={`hover:cursor-pointer dark:hover:text-white ${
                          active === "completed" ? "text-blue-400" : ""
                        }`}>
                        Complete
                      </li>
                    </ul>
                    <p
                      onClick={clearCompletedHandler}
                      className="clear-completed order-2 hover:cursor-pointer dark:hover:text-white min-[500px]:order-3 min-[500px]:basis-auto">
                      Clear Completed
                    </p>
                  </div>
                </div>
              )}
            </Droppable>

            {/* for mobile : filter seciton */}
            <ul className="order-3 flex justify-center space-x-5 rounded-lg bg-light-gray-50 py-3 text-light-gray-300 shadow-xl dark:bg-dark-gray-100 dark:text-dark-gray-400 min-[500px]:order-2 min-[600px]:hidden">
              <li
                onClick={() => {
                  filterListHandler("all");
                }}
                className={`hover:cursor-pointer dark:hover:text-white ${
                  active === "all" ? "text-blue-400" : ""
                }`}>
                All
              </li>
              <li
                onClick={() => {
                  filterListHandler("active");
                }}
                className={`hover:cursor-pointer dark:hover:text-white ${
                  active === "active" ? "text-blue-400" : ""
                }`}>
                Active
              </li>
              <li
                onClick={() => {
                  filterListHandler("completed");
                }}
                className={`hover:cursor-pointer dark:hover:text-white ${
                  active === "completed" ? "text-blue-400" : ""
                }`}>
                Complete
              </li>
            </ul>
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default Main;
