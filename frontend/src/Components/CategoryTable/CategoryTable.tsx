import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../Utils/axiosInstance";

export interface CategoryItem {
  id: number;
  name: string;
  sum: number;
  createdAt: string;
}

interface CategoriesTableProps {
  title: string;
  categories: CategoryItem[];
  setExpenseCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  setIncomeCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
}

interface EditableCategoryName {
  [key: number]: string;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  title,
  categories,
  setExpenseCategories,
  setIncomeCategories,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editableCategoryName, setEditableCategoryName] =
    useState<EditableCategoryName>({});

  const navigate = useNavigate();

  const handleCategoryNameChange = (id: number, newName: string) => {
    setEditableCategoryName((prevNames) => ({
      ...prevNames,
      [id]: newName,
    }));
  };

  const handleCreateNew = async () => {
    const endpoint =
      title === "Expense Categories"
        ? "expense-categories"
        : "income-categories";
    const userId = localStorage.getItem("userId");

    try {
      const response = await axiosInstance.post(
        `http://localhost:3000/${endpoint}`,
        {
          name: newCategoryName,
          sum: 0,
          userId: userId, 
        }
      );

      if (response.status === 201) {
        if (endpoint === "expense-categories") {
          setExpenseCategories((prevCategories) => [
            ...prevCategories,
            response.data,
          ]);
        } else {
          setIncomeCategories((prevCategories) => [
            ...prevCategories,
            response.data,
          ]);
        }
        setNewCategoryName("");
      }
    } catch (error) {
      console.error("Error creating new category:", error);
    }
  };

  const handleEditCategory = async (categoryId: number) => {
    const endpoint =
      title === "Expense Categories"
        ? "expense-categories"
        : "income-categories";
    const updatedName = editableCategoryName[categoryId];

    try {
      const response = await axiosInstance.put(
        `http://localhost:3000/${endpoint}/${categoryId}`,
        {
          name: updatedName,
        }
      );

      if (response.status === 200) {
        const updateFunction =
          endpoint === "expense-categories"
            ? setExpenseCategories
            : setIncomeCategories;
        updateFunction((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === categoryId ? { ...cat, name: updatedName } : cat
          )
        );
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const endpoint =
      title === "Expense Categories"
        ? "expense-categories"
        : "income-categories";

    try {
      const response = await axiosInstance.delete(
        `http://localhost:3000/${endpoint}/${categoryId}`
      );

      if (response.status === 200 || response.status === 204) {
        const updateCategories =
          endpoint === "expense-categories"
            ? setExpenseCategories
            : setIncomeCategories;
        updateCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const navigateToCategory = (categoryId: number) => {
    const path =
      title === "Expense Categories"
        ? `/expense-category/${categoryId}`
        : `/income-category/${categoryId}`;
    navigate(path);
  };

  return (
    <div className="m-4 p-4 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          {editMode ? "View" : "Edit"}
        </button>
      </div>
      {editMode && (
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="mr-2 p-2 border rounded shadow"
          />
          <button
            onClick={handleCreateNew}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
          >
            Create New Category
          </button>
        </div>
      )}
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Sum
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Created At
            </th>
            {editMode && (
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {editMode ? (
                  <input
                    type="text"
                    value={editableCategoryName[category.id] || category.name}
                    onChange={(e) =>
                      handleCategoryNameChange(category.id, e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <div
                    onClick={() => !editMode && navigateToCategory(category.id)}
                    className={`hover:underline cursor-pointer ${
                      editMode ? "bg-gray-50" : ""
                    }`}
                  >
                    {category.name}
                  </div>
                )}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {category.sum}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              {editMode && (
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex justify-around">
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
