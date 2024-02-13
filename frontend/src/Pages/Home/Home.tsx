import { useEffect, useState } from "react";

import axiosInstance from "../../Utils/axiosInstance";
import {
  CategoriesTable,
  CategoryItem,
} from "../../Components/CategoryTable/CategoryTable";

export const Home = () => {
  const [expenseCategories, setExpenseCategories] = useState<CategoryItem[]>(
    []
  );
  const [incomeCategories, setIncomeCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      await axiosInstance
        .get(
          `http://localhost:3000/categories/${localStorage.getItem("userId")}`
        )
        .then((res) => {
          setExpenseCategories(res.data.expenseCategories);
          setIncomeCategories(res.data.incomeCategories);
        });
    };

    getUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <CategoriesTable
          title="Expense Categories"
          categories={expenseCategories}
          setExpenseCategories={setExpenseCategories}
          setIncomeCategories={setIncomeCategories}
        />
        <CategoriesTable
          title="Income Categories"
          categories={incomeCategories}
          setExpenseCategories={setExpenseCategories}
          setIncomeCategories={setIncomeCategories}
        />
      </div>
    </div>
  );
};
