import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Navigation } from "./Components/Navigation/Navigation";

import { Home } from "./Pages/Home/Home";
import { Register } from "./Pages/Register/Register";
import { Transactions } from "./Pages/Transactions/Transactions";
import { AuthScreen } from "./Pages/AuthScreen/AuthScreen";
import { AboutPage } from "./Pages/About/About";
import { CategoryDetails } from "./Pages/CategoryDetails/CategoryDetails";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/expense-category/:id"
          element={<CategoryDetails title="Expense" endpoint="expenses"/>}
        />
        <Route
          path="/income-category/:id"
          element={<CategoryDetails title="Income" endpoint="incomes" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
