import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";

import {
  GET_CONTACTS_BY_USER,
  GET_CHAT_BY_PARTICIPANTS,
  CHECK_IF_USER_HAS_BLOCKED_YOU,
} from "../../../graphql/queries";
import useField from "../../../hooks/useField";

import Loading from "../../Loading";
import SearchBar from "../../SearchBar";
import SelectContactList from "./SelectContactList";

import useNotifyMessage from "../../../hooks/useNotifyMessage";
import Notify from "../../Notify";

const NewIndividualChatModal = ({ user, setShowNewIndividualChatModal }) => {
  const notifyMessage = useNotifyMessage();
  const navigate = useNavigate();
  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserId, setChosenUserId] = useState(null);

  const result = useQuery(GET_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const [getChatByParticipants] = useLazyQuery(GET_CHAT_BY_PARTICIPANTS);

  const [checkIfUserHasBlockedYou] = useLazyQuery(
    CHECK_IF_USER_HAS_BLOCKED_YOU
  );

  const handleCreateIndividualChat = async () => {
    console.log("Press create a individual new chat!");
    console.log("Chosen user id:", chosenUserId);

    if (!chosenUserId) {
      notifyMessage.show("Please select a contact to create a chat with!");
      return;
    }

    const checkIfChatExists = await getChatByParticipants({
      variables: {
        participants: [user.id, chosenUserId],
      },
    });

    if (checkIfChatExists.data?.findChatByParticipants) {
      navigate(`/chats/${checkIfChatExists.data.findChatByParticipants.id}`);
      setShowNewIndividualChatModal(false);
      return;
    }

    const checkIfContactHasBlockedYou = await checkIfUserHasBlockedYou({
      variables: {
        userId: chosenUserId,
      },
    });

    if (checkIfContactHasBlockedYou.data?.checkIfUserHasBlockedYou) {
      notifyMessage.show("This user has blocked you!");
      return;
    }

    const chosenContact = result.data.allContactsByUser.contacts.find(
      (contact) => contact.id === chosenUserId
    );

    const newPrivateChatInfo = {
      title: chosenContact.name,
      description: "",
      participants: [user, chosenContact],
      image: chosenContact.image.thumbnail,
    };

    localStorage.setItem("new-chat-info", JSON.stringify(newPrivateChatInfo));
    navigate("/chats/new");
    setShowNewIndividualChatModal(false);
  };

  console.log("Selected user:", chosenUserId);

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-10 transition"
      onClick={() => setShowNewIndividualChatModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        key={"newChatModal"}
        className="w-[500px] h-[600px] bg-white dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-100 z-100"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="h-full flex-grow flex flex-col py-4 px-4">
          <div className="w-full flex justify-center items-center pb-2">
            <button onClick={() => setShowNewIndividualChatModal(false)}>
              <MdClose className="w-7 h-7 text-slate-800 dark:text-slate-100 fill-current" />
            </button>
            <h2 className="flex-grow text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
              {"New Individual Chat"}
            </h2>
            <button onClick={handleCreateIndividualChat}>
              <IoChevronForward className="w-7 h-7 text-slate-800 dark:text-slate-100 fill-current" />
            </button>
          </div>
          <>
            <Notify notifyMessage={notifyMessage} />
            <SearchBar searchWord={searchWord} />
            {result.loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex-grow w-full overflow-y-auto h-0">
                  <SelectContactList
                    user={user}
                    data={result.data.allContactsByUser.contacts}
                    chosenUserId={chosenUserId}
                    setChosenUserId={setChosenUserId}
                  />
                </div>
              </>
            )}
          </>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewIndividualChatModal;
