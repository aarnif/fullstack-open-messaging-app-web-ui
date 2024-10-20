const ContactCard = ({ user, item, admin }) => {
  return (
    <div className="mr-4 flex-grow flex items-start">
      <div>
        <img
          className="w-16 h-16 rounded-full"
          src={item.image.thumbnail}
          alt={item.name}
        />
      </div>
      <div className="flex-grow ml-4">
        {user?.id === item.id ? (
          <>
            <div className="flex justify-between items-start">
              <div className="text-md text-slate-700 font-bold">
                You{" "}
                {admin?.id === item.id && (
                  <span className="text-md text-slate-500 font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-md text-slate-500 font-bold">
                @{item.username}
              </div>
            </div>
            <div className="text-sm text-slate-700 text-left">{item.about}</div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div className="text-md text-slate-700 font-bold">
                {item.name}{" "}
                {admin?.id === item.id && (
                  <span className="text-md text-slate-700 font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-md text-slate-500 font-bold">
                @{item.username}
              </div>
            </div>
            <div className="text-sm text-slate-700 text-left">{item.about}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
