import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="bg-blue-500 text-white p-4 shadow-md">
      <ul className="flex justify-center space-x-4">
        <li className="hover:bg-blue-700 hover:text-white px-3 py-2 rounded">
          <Link to="/home">Home</Link>
        </li>
        <li className="hover:bg-blue-700 hover:text-white px-3 py-2 rounded">
          <Link to="/">Login or register</Link>
        </li>
        <li className="hover:bg-blue-700 hover:text-white px-3 py-2 rounded">
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};
