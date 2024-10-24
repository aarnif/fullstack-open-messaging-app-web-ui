import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { IoChevronBack } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";

import { GET_ALL_USERS } from "../../../graphql/queries";
import { EDIT_CHAT, UPDATE_CHAT_MEMBERS } from "../../../graphql/mutations";
import imageService from "../../../services/imageService";
import ChangeImage from "./ChangeImage";
import useField from "../../../hooks/useField";
import ChatMembersList from "../GroupChatInfoModal/ChatMembersList";
import UpdateMembersModal from "./UpdateMembersModal";
import useConfirmModal from "../../../hooks/useConfirmModal";

const EditGroupChatModal = ({
  user,
  chat,
  chatAdmin,
  showEditGroupChatModal,
}) => {
  const { confirmModal } = useConfirmModal();
  const [base64Image, setBase64Image] = useState(null);
  const [showUpdateMembersModal, setShowUpdateMembersModal] = useState(false);
  const title = useField("text", "Enter chat title here...", chat.title);
  const description = useField(
    "text",
    "Enter chat description here...",
    chat.description
  );
  const [chosenUserIds, setChosenUserIds] = useState([
    ...chat.participants.map((participant) => participant.id),
  ]);

  const [newMemberIds, setNewMemberIds] = useState([
    ...chat.participants.map((participant) => participant.id),
  ]);

  const result = useQuery(GET_ALL_USERS);

  const [editChat] = useMutation(EDIT_CHAT, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const [editChatMembers] = useMutation(UPDATE_CHAT_MEMBERS, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const goBack = () => {
    console.log("Go back to chat page!");
    showEditGroupChatModal(false);
  };

  const handleSubmit = async (event) => {
    console.log("Handle submit edit chat...");
    console.log("Chosen user ids:", chosenUserIds);

    try {
      let result;

      if (base64Image) {
        console.log("Uploading chat picture...");
        result = await imageService.uploadImage(chat.id, base64Image);
      }

      console.log("Result:", result);

      const newChatImage = base64Image
        ? {
            thumbnail: result.data.thumb.url,
            original: result.data.image.url,
          }
        : {
            thumbnail: chat.image.thumbnail,
            original: chat.image.original,
          };

      const newChatData = {
        chatId: chat.id,
        title: title.value,
        description: description.value,
        input: newChatImage,
      };

      console.log("New chat data:", newChatData);

      await editChat({
        variables: newChatData,
      });

      await editChatMembers({
        variables: {
          chatId: chat.id,
          participants: chosenUserIds,
        },
      });

      console.log("Edit chat success!");
    } catch (error) {
      console.log("Error editing chat:", error);
      console.log(error);
    }

    setShowUpdateMembersModal(false);
    showEditGroupChatModal(false);
  };

  const handleClickSubmit = (event) => {
    event.preventDefault();
    confirmModal(
      "Are you sure you want to update the chat information?",
      handleSubmit
    );
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-white">
        <div className="w-full flex-grow p-8 flex flex-col">
          <div className="w-full flex-grow flex flex-col justify-center items-center bg-white">
            <form
              className="w-full flex-grow flex flex-col"
              onSubmit={handleClickSubmit}
            >
              <div className="w-full flex justify-center items-center pb-4">
                <div className="w-[70px] flex justify-start items-center">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center">
                    <button onClick={goBack}>
                      <IoChevronBack className="w-7 h-7 text-slate-700 fill-current" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow flex justify-center items-center">
                  <h2 className="text-xl text-slate-700 font-bold">
                    Edit Chat
                  </h2>
                </div>
                <div className="w-[70px] flex justify-end items-center">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center"></div>
                </div>
              </div>
              <ChangeImage
                currentImage={chat.image.thumbnail}
                imageType={"chat"}
                setBase64Image={setBase64Image}
              />
              <ul className="flex-grow flex flex-col">
                <li className="w-full flex flex-col">
                  <label className="text-md font-bold text-slate-700">
                    Chat title:
                  </label>
                </li>
                <li className="mb-4 w-full flex flex-col">
                  <input
                    className="w-full flex-grow p-2 rounded-lg bg-slate-200
                  focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400 transition"
                    {...title}
                  />
                  {title.value.length === 0 && (
                    <span className="text-md text-red-500">
                      Please enter your title
                    </span>
                  )}
                </li>

                <li className="w-full flex flex-col">
                  <label className="text-md font-bold text-slate-700">
                    Chat description:
                  </label>
                </li>
                <li className="mb-4 w-full flex flex-col">
                  <input
                    className="w-full flex-grow p-2 rounded-lg bg-slate-200
                  focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400 transition"
                    {...description}
                  />
                  {description.value.length === 0 && (
                    <span className="text-md text-red-500">
                      Please enter your description
                    </span>
                  )}
                </li>

                <li className="my-4 w-full flex justify-center items-end">
                  <button
                    type="button"
                    className="w-full flex-grow max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
                    onClick={() => setShowUpdateMembersModal(true)}
                  >
                    <div className="text-md font-bold text-slate-700">
                      Update members
                    </div>
                  </button>
                </li>

                <li className="w-full flex-grow flex flex-col justify-center items-center">
                  <ChatMembersList
                    user={user}
                    chatParticipants={
                      result.loading
                        ? chat.participants
                        : result.data.allUsers.filter((user) =>
                            newMemberIds.includes(user.id)
                          )
                    }
                    admin={chatAdmin}
                  />
                </li>

                <li className="my-4 w-full flex justify-center items-end">
                  <button
                    type="submit"
                    className="w-full flex-grow max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
                  >
                    <div className="text-lg font-bold text-slate-700">
                      Edit Chat
                    </div>
                  </button>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showUpdateMembersModal && (
          <UpdateMembersModal
            chat={chat}
            chosenUserIds={chosenUserIds}
            setChosenUserIds={setChosenUserIds}
            setNewMemberIds={setNewMemberIds}
            setShowUpdateMembersModal={setShowUpdateMembersModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EditGroupChatModal;
