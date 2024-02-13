import React, { useState, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom";

import axiosInstance from "../../Utils/axiosInstance";

interface Item {
  id: number;
  name: string;
  amount: number;
  createdAt: Date;
}

interface NewItem {
  name: string;
  amount: string;
}

interface EditableItem {
  [key: number]: { name: string; amount: string };
}

interface CategoryDetailsProps {
  endpoint: "incomes" | "expenses";
  title: string;
}

export const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  endpoint,
  title,
}) => {
  const { id: categoryId } = useParams<{ id: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editableIncomes, setEditableIncomes] = useState<EditableItem>({});
  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    amount: "",
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const itemsResponse = await axiosInstance.get(
          `/${endpoint}/${categoryId}`
        );
        setItems(itemsResponse.data);
        const initialEditableIncomes = itemsResponse.data.reduce(
          (acc: EditableItem, income: Item) => {
            acc[income.id] = {
              name: income.name,
              amount: income.amount.toString(),
            };
            return acc;
          },
          {}
        );
        setEditableIncomes(initialEditableIncomes);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId, endpoint]);

  const handleInputChange = (
    incomeId: number,
    field: "name" | "amount",
    value: string
  ) => {
    setEditableIncomes((prev) => ({
      ...prev,
      [incomeId]: { ...prev[incomeId], [field]: value },
    }));
  };

  const handleSaveEdit = async (incomeId: number) => {
    const updatedIncome = editableIncomes[incomeId];
    try {
      await axiosInstance.put(`/${endpoint}/${incomeId}`, {
        name: updatedIncome.name,
        amount: parseFloat(updatedIncome.amount),
      });
      setItems(
        items.map((income) =>
          income.id === incomeId
            ? {
                ...income,
                ...updatedIncome,
                amount: parseFloat(updatedIncome.amount),
              }
            : income
        )
      );
      setEditMode(false);
    } catch (error) {
      console.error(`Error updating ${title}:`, error);
    }
  };

  const handleDelete = async (incomeId: number) => {
    try {
      await axiosInstance.delete(`/${endpoint}/${incomeId}`);
      setItems(items.filter((income) => income.id !== incomeId));
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
    }
  };

  const handleNewItemChange = (field: keyof NewItem, value: string) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const getCategoryFieldName = (endpoint: string) => {
    return endpoint === "incomes" ? "incomeCategoryId" : "expenseCategoryId";
  };

  const handleSubmitNewItem = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/${endpoint}`, {
        name: newItem.name,
        amount: parseFloat(newItem.amount),
        [getCategoryFieldName(endpoint)]: categoryId,
        userId: localStorage.getItem("userId"),
      });
      setItems([...items, response.data]);
      setNewItem({ name: "", amount: "" });
    } catch (error) {
      console.error(`Error creating new ${title}:`, error);
    }
  };

  return (
    <div className="m-4 p-4 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title} Category Details</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          {editMode ? "View" : "Edit"}
        </button>
      </div>
      <table className="min-w-full leading-normal">
        <thead>
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
        </thead>
        <tbody>
          {items.map((income) => (
            <tr key={income.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {editMode ? (
                  <input
                    type="text"
                    value={editableIncomes[income.id]?.name}
                    onChange={(e) =>
                      handleInputChange(income.id, "name", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  income.name
                )}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {editMode ? (
                  <input
                    type="number"
                    value={editableIncomes[income.id]?.amount}
                    onChange={(e) =>
                      handleInputChange(income.id, "amount", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  `$${income.amount.toLocaleString()}`
                )}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {new Date(income.createdAt).toLocaleDateString()}
              </td>
              {editMode && (
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex justify-around">
                  <button
                    onClick={() => handleSaveEdit(income.id)}
                    className="py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
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
      <form onSubmit={handleSubmitNewItem} className="mt-4">
        <div className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => handleNewItemChange("name", e.target.value)}
            className="border px-2 py-1 rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newItem.amount}
            onChange={(e) => handleNewItemChange("amount", e.target.value)}
            className="border px-2 py-1 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
        >
          Add New {title}
        </button>
      </form>
    </div>
  );
};
