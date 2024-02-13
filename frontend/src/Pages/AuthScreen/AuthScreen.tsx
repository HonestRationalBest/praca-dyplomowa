import { Login } from "../Login/Login";
import { Register } from "../Register/Register";

export const AuthScreen = () => {
  return (
    <div className="flex flex-col md:flex-row md:space-x-10 justify-center p-4">
      <div className="shadow-lg p-6 mb-6 md:mb-0">
        <Login />
      </div>
      <div className="shadow-lg p-6">
        <Register />
      </div>
    </div>
  );
};
