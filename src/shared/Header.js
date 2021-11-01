import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { ContactContext } from "../utils/contactContext";

function Header(props) {
  const [contacts, setContacts] = useState();
  const [userNames, setUserNames] = useState([]);

  const { currentUser, setCurrentUser } = useContext(ContactContext);

  const defaultOption = {
    label: `${currentUser?.firstName}`,
    value: currentUser?.id,
  };
  const location = useLocation();

  useEffect(() => {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setContacts([...contacts]);
    const userNames = contacts.map((contact) => {
      return {
        label: `${contact.firstName}`,
        value: contact.id,
      };
    });

    if (!currentUser) setUserNames(userNames);
    //eslint-disable-next-line
  }, []);

  const onUserSelect = (e) => {
    if (!e.value) return;
    const selectedUser = contacts.find((contact) => contact.id === e.value);
    setCurrentUser(selectedUser);
    localStorage.setItem("currentUser", JSON.stringify(selectedUser));
  };

  return (
    <div className="bg-gray-200 h-14 z-50 flex justify-between items-center px-5  fixed w-screen">
      <Link to="/">CONTAQT</Link>

      <div className="w-1/5 1sm:w-1/3">
        {location?.pathname.length > 1 || !currentUser ? null : (
          <Dropdown
            options={userNames}
            className="bg-gray-100 w-full h-10"
            placeholder="Select a user"
            onChange={(e) => onUserSelect(e)}
            value={defaultOption}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
