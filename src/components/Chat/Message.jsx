import helpers from "../../utils/helpers";

const NotificationMessage = ({ message }) => {
  return (
    <div className="mr-2 my-2 flex flex-col items-center">
      <div className="min-w-[100px] max-w-[300px] flex justify-center items-center pt-2 px-2 pb-1 bg-slate-300 rounded-lg">
        <div className="text-slate-800 text-sm text-center">{`${message.content}`}</div>
      </div>
    </div>
  );
};

const MessageByAnotherUser = ({ message, handlePressImage }) => {
  return (
    <div className="mr-2 my-2 flex flex-col items-start">
      <div className="min-w-[100px] max-w-[600px] ml-8 pt-2 px-2 flex flex-col bg-slate-300 rounded-lg">
        <div className="text-slate-800 font-bold">{message.sender.name}</div>
        {message.image.thumbnail && (
          <div>
            <button onClick={handlePressImage}>
              <img
                src={message.image.thumbnail}
                alt="message-thumbnail"
                style={{ width: 100, height: 100 }}
              />
            </button>
          </div>
        )}
        {message.content && (
          <div
            style={{
              marginTop: message.image.thumbnail ? 2 : 0,
              fontSize: message.type === "singleEmoji" ? 32 : "inherit",
              textAlign: message.type === "singleEmoji" ? "center" : "inherit",
            }}
            className="text-slate-800"
          >
            {message.content}
          </div>
        )}
        <div className="my-1 text-end text-xs text-slate-800 ">
          {helpers.formatMessageTime(message.createdAt)}
        </div>
      </div>
      <img
        src={message.sender.image.thumbnail}
        alt="sender-thumbnail"
        className="w-12 h-12 rounded-full"
      />
    </div>
  );
};

const MessageByCurrentUser = ({ message, handlePressImage }) => {
  return (
    <div className="mr-2 my-2 flex flex-col items-end">
      <div className="min-w-[100px] max-w-[600px] mr-8 pt-2 px-2 flex flex-col bg-green-300 rounded-lg">
        {message.image.thumbnail && (
          <div>
            <button onClick={handlePressImage}>
              <img
                src={message.image.thumbnail}
                alt="message-thumbnail"
                style={{ width: 100, height: 100 }}
              />
            </button>
          </div>
        )}
        {message.content && (
          <div
            style={{
              marginTop: message.image.thumbnail ? 2 : 0,
              fontSize: message.type === "singleEmoji" ? 32 : "inherit",
              textAlign: message.type === "singleEmoji" ? "center" : "inherit",
            }}
            className="text-slate-800"
          >
            {message.content}
          </div>
        )}
        <div className="my-1 text-xs text-slate-800 text-end">
          {helpers.formatMessageTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

const Message = ({ user, message, handlePressImage }) => {
  if (message.type === "notification") {
    return <NotificationMessage message={message} />;
  }

  return (
    <>
      {message.sender.id === user.id ? (
        <MessageByCurrentUser
          message={message}
          handlePressImage={handlePressImage}
        />
      ) : (
        <MessageByAnotherUser
          message={message}
          handlePressImage={handlePressImage}
        />
      )}
    </>
  );
};

export default Message;
