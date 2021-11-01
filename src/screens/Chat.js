import React, { useContext, useEffect, useState, useRef } from "react";
import { ContactContext } from "../utils/contactContext";

const Chat = (props) => {
  const [contact, setContact] = useState();

  const [message, setMessage] = useState();
  const [chat, setChat] = useState([]);

  const messagesRef = useRef(null);
  const containerRef = useRef(null);

  const { currentUser } = useContext(ContactContext);

  useEffect(() => {
    const contacts = JSON.parse(localStorage.getItem("contacts"));

    const user = contacts.find(
      (contact) => contact.id === props.match.params.id
    );
    setContact(user);
    //eslint-disable-next-line
  }, [messagesRef]);

  useEffect(() => {
    const getChats = () => {
      if (currentUser) {
        const allChats = JSON.parse(localStorage.getItem("chats"));
        if (allChats) {
          const senderId = currentUser?.id;
          const recieverId = props.match.params.id;

          var sentMessages =
            allChats[senderId]?.filter(
              (chat) => chat.recieverId === recieverId
            ) || [];

          var recievedMessages =
            allChats[recieverId]?.filter(
              (chat) => chat.recieverId === currentUser.id
            ) || [];

          setChat(sortMessages(sentMessages, recievedMessages));
        }
      }
    };

    getChats();
    window.addEventListener("storage", () => getChats());

    // setSentMessages(sentMessages);
    //eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    messagesRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [chat]);

  const sortMessages = (sentMessages, recievedMessages) => {
    return [...sentMessages, ...recievedMessages].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (message === "") return;

    const chats = JSON.parse(localStorage.getItem("chats")) || {};
    const currentChat = [...chat];
    const previousMessages = chats[`${currentUser?.id}`] || [];

    currentChat.push({
      message,
      senderId: currentUser?.id,
      recieverId: props.match.params.id,
      time: new Date(),
    });

    setChat([...currentChat]);

    previousMessages.push({
      message,
      senderId: currentUser.id,
      recieverId: props.match.params.id,
      time: new Date(),
    });
    chats[`${currentUser.id}`] = previousMessages;
    localStorage.setItem("chats", JSON.stringify(chats));
    setMessage("");
  };

  return (
    <div className="h-screen 1sm:w-screen  mt-12  mx-auto  overflow-x-hidden">
      <div
        ref={containerRef}
        className="h-85vh  w-2/3 1sm:w-full mx-auto  md:h-10/12   flex-col "
      >
        <div className="h-full  overflow-scroll scrollbar-hidden">
          {chat.map((item, i) => (
            <div
              ref={messagesRef}
              className={` flex p-3 text-gray-500  ${
                item.senderId === currentUser?.id
                  ? " text-right  justify-end"
                  : " text-left "
              }`}
            >
              {item.senderId === props.match.params.id && (
                <p className="rounded-full font-bold leading-loose px-4 mx-2 text-2xl max-h-12 bg-green-400 bg-opacity-25 text-green-400">
                  {contact?.firstName[0].toUpperCase()}
                </p>
              )}
              <div
                className={`max-w-xs break-words text-wrap min-w-1/2 p-3 rounded-xl ${
                  item.senderId === currentUser?.id
                    ? "bg-blue-400 "
                    : "bg-green-500 bg-opacity-75"
                }`}
              >
                <p
                  className={` ${
                    item.senderId === currentUser?.id
                      ? "text-white "
                      : "text-white"
                  }`}
                >
                  {item.message}
                </p>
              </div>
              {item.senderId === currentUser?.id && (
                <p className="rounded-full  font-bold leading-loose px-4 mx-2 text-2xl max-h-12 bg-gray-400">
                  {currentUser?.firstName[0].toUpperCase()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className=" xl:pt-0  w-full z-20 h-14 mt-5 1sm:mt-2">
        <form
          onSubmit={(e) => {
            sendMessage(e);
          }}
          className=" flex w-2/3 h-10  1sm:w-full mx-auto 2xl:mt  md:my-5 1sm:my-3 1sm:px-2"
        >
          <input
            className="border-2 w-9/12 h-10  focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
          ></input>
          <button
            className="bg-blue-500 text-white w-3/12 h-10  px-3 mx-2 1sm:mx-0 1sm:ml-2 rounded focus:outline-none"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
