import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import uuid from "react-uuid";

import Modal from "../shared/Modal";
import { ContactContext } from "../utils/contactContext";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([...contacts]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState();

  const { currentUser, setCurrentUser } = useContext(ContactContext);

  useEffect(() => {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts([...contacts]);
    if (!openModal) setSelectedContact(null);
  }, [openModal]);

  useEffect(() => {
    setFilteredContacts([...contacts]);

    //eslint-disable-next-line
  }, [contacts]);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.value) {
        const contact = JSON.parse(e.newValue)[0];
        const tempContacts = [...contacts];
        tempContacts[contact.index] = contact;
        setContacts([...tempContacts]);
      }
    });
    //eslint-disable-next-line
  }, []);

  const searchContact = (e) => {
    const searchString = e.target.value && e.target.value.trim();
    const filtered = contacts.filter(
      (contact) =>
        searchString === "" ||
        contact.firstName
          .toLocaleLowerCase()
          .trim()
          .includes(searchString.toLocaleLowerCase()) ||
        contact.lastName
          .toLocaleLowerCase()
          .trim()
          .includes(searchString.toLocaleLowerCase())
    );
    setFilteredContacts([...filtered]);
  };

  const addContact = (values) => {
    const user = { ...values, id: uuid() };
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    if (contacts.length === 0) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
    }
    if (contacts.some((contact) => contact.mailId === values.mailId)) {
      return;
    } else {
      contacts.push(user);
      setContacts([...contacts]);
      setFilteredContacts([...contacts]);

      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  };

  const editContact = (values) => {
    const tempContacts = [...contacts];
    tempContacts[values.index] = values;
    setContacts(tempContacts);
    localStorage.setItem("contacts", JSON.stringify(tempContacts));
  };

  return (
    <div className=" absolute w-full mt-14 overflow-x-hidden">
      <Modal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        addContact={addContact}
        editContact={editContact}
        initialValues={selectedContact}
      />
      <div className="flex-col w-1/2 1sm:w-11/12 md:w-3/4   mx-auto overflow-x-hidden">
        <div class="p-2 flex 1sm:flex-col w-full mx-auto ">
          <div class="bg-white flex items-center rounded border shadow w-2/3 1sm:w-full ">
            <input
              class="rounded-l-full w-full py-4 px-6 1sm:px-2 1sm:py-3 text-gray-700 xl;leading-tight focus:outline-none"
              id="search"
              type="text"
              placeholder="Search"
              onChange={(e) => searchContact(e)}
              autoComplete="off"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="w-1/3 1sm:w-full border text-white ml-2 1sm:ml-0 1sm:mt-2 shadow bg-blue-500 hover:bg-blue-700 focus:outline-none font-bold py-2 px-4 rounded"
          >
            Add contact
          </button>
        </div>
        {filteredContacts
          .filter((contact) => currentUser && contact.id !== currentUser.id)
          .map((contact, i) => (
            <div className="flex border my-5 p-3 rounded ">
              <Link
                className="flex justify-between sm:w-3/4 w-3/5 md:w-3/4 xl:w-3/4"
                to={`/chat/${contact.id}`}
              >
                <div className="w-2/3 sm:w-2/5 1sm:w-3/5   text-left ">
                  <div className="xsm:text-xs text-xl lg:text-lg 1sm:text-sm md:text-base">
                    {contact.firstName + " " + contact.lastName}
                  </div>
                  <div className="text-sm xsm:text-xs text-label xsm:hidden block">
                    {contact.mailId}
                  </div>
                </div>
                <div className="text-md w-1/3 p-3 xsm:text-xs">
                  {contact.companyName}
                </div>
              </Link>
              <div className="flex justify-end py-3 px-3 mx-auto w-1/6 z-10">
                <div
                  onClick={() => {
                    setSelectedContact({ ...contact, index: i });
                    setOpenModal(true);
                  }}
                  className="focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="xsm:h-4 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
