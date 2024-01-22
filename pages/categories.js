import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState();
  const [parentCategory, setParentCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
  }

  async function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete category ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d55",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/api/categories?id=${category._id}`);
          fetchCategories();
        }
      });
  }

  return (
    <Layout>
      <h1>Категории</h1>
      <label>
        {editedCategory
          ? `Изменить категорию: ${editedCategory.name}`
          : "Создать новую категорию"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"имя категории"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value={null}>нет родительской категории</option>
          {categories.map((category) => (
            <option key={`option-${category._id}`} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Сохранить
        </button>
      </form>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Название категории</td>
            <td>Родительская категория</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={`tr-${category._id}`}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-primary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
