import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import EditProfile from "./EditProfile";
import NonEditProfile from "./NonEditProfile";

const ProfileMainPage = () => {
  const { users } = useAuth();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <div className="main-container">
      {isEdit ? (
        <EditProfile users={users} setIsEdit={setIsEdit} />
      ) : (
        <NonEditProfile users={users} setIsEdit={setIsEdit} />
      )}
    </div>
  );
};

export default ProfileMainPage;
