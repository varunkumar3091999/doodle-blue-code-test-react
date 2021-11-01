import ReactModal from "react-modal";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { ContactContext } from "../utils/contactContext";

const Modal = ({
  openModal,
  closeModal,
  addContact,
  initialValues,
  editContact,
}) => {
  const { currentUser } = useContext(ContactContext);
  const contact = initialValues
    ? initialValues
    : {
        firstName: "",
        lastName: "",
        mailId: "",
        phoneNum: "",
        companyName: "",
        city: "",
      };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      // transform: "translate(-50%, -50%)",
      outerWidth: "100vw",
    },
    overlay: { zIndex: 1000 },
    outerWidth: "50vw",
  };

  const validationSchema = () =>
    Yup.object().shape({
      firstName: Yup.string()
        .min(2, "Too short!")
        .max(50, "Too long")
        .required("Cannot be empty"),
      lastName: Yup.string()
        .min(2, "Too short!")
        .max(50, "Too long")
        .required("Cannot be empty"),
      mailId: Yup.string()
        .email()
        .min(2, "Too short!")
        .max(50, "Too long")
        .required("Cannot be empty"),
      phoneNum: Yup.string()
        .min(2, "Too short!")
        .max(50, "Too long")
        .required("Cannot be empty"),
      companyName: Yup.string()
        .min(2, "Too short!")
        .max(50, "Too long")
        .required("Cannot be empty"),
      city: Yup.string().min(2, "Too short!").max(50, "Too long"),
    });

  return (
    <div className="w-full  flex-col justify-center overflow-x-hidden">
      <ReactModal
        style={customStyles}
        isOpen={openModal}
        className="w-1/2 lg:w-3/4 1sm:w-11/12 mx-auto overflow-y-scroll scrollbar-hidden h-5/6 my-10  rounded focus:outline-none 	"
      >
        <Formik
          initialValues={contact}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (contact.firstName.length < 0) {
              editContact(values);
            } else {
              addContact(values);
            }
            closeModal();
          }}
        >
          {({ errors, touched }) => (
            <Form
              className="bg-white shadow-xl border py-8 justify-self-center"
              autoComplete="off"
            >
              <div className="my-2 w-3/4 mx-auto ">
                <p>
                  First Name:{" "}
                  {touched.firstName && errors.firstName && (
                    <span className="text-red-300">({errors.firstName})</span>
                  )}
                </p>

                <Field
                  className="w-full h-9 border focus:outline-none p-2 rounded"
                  name="firstName"
                />
              </div>
              <div className="my-2 w-3/4 mx-auto">
                <p>
                  Last Name:{" "}
                  {touched.lastName && errors.lastName && (
                    <span>({errors.lastName})</span>
                  )}
                </p>

                <Field
                  name="lastName"
                  className="w-full h-9 border focus:outline-none p-2 rounded"
                />
              </div>
              <div className="my-2 w-3/4 mx-auto ">
                <p>
                  Email ID:{" "}
                  {touched.mailId && errors.mailId && (
                    <span>({errors.mailId})</span>
                  )}
                </p>

                <Field
                  name="mailId"
                  className="w-full h-9 border focus:outline-none p-2 rounded"
                />
              </div>
              <div className="my-2 w-3/4 mx-auto">
                <p>
                  Phone Number:{" "}
                  {touched.phoneNum && errors.phoneNum && (
                    <span>({errors.phoneNum})</span>
                  )}
                </p>

                <Field
                  name="phoneNum"
                  className="w-full h-9 border focus:outline-none p-2 rounded"
                />
              </div>
              <div className="my-2 w-3/4 mx-auto">
                <p>
                  Company Name:{" "}
                  {touched.companyName && errors.companyName && (
                    <span>({errors.companyName})</span>
                  )}
                </p>

                <Field
                  name="companyName"
                  className="w-full h-9 border focus:outline-none p-2 rounded"
                />
              </div>
              <div className="my-2 w-3/4 mx-auto">
                <p>
                  City:{" "}
                  {touched.city && errors.city && (
                    <span className="text-red-300">{errors.city}</span>
                  )}
                </p>

                <Field
                  name="city"
                  className="w-full h-9 border focus:outline-none p-2 rounded"
                />
              </div>
              {!currentUser ? (
                <div className="text-sm w-3/4 text-gray-400 mx-auto">
                  This is the first contact and this will be considered as the
                  currentUser
                </div>
              ) : null}
              <div className="my-2 w-3/4 mx-auto flex justify-end my-4">
                <button
                  className="border px-5 py-2 bg-red-300 rounded focus:outline-none"
                  type="button"
                  onClick={() => closeModal()}
                >
                  Cancel
                </button>
                <button
                  className="border px-5 py-2 bg-green-500 rounded ml-3"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ReactModal>
    </div>
  );
};

export default Modal;
