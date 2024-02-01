import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState();
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

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
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setProperties([]);
    setParentCategory("");
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
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

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((_p, pIndex) => pIndex !== indexToRemove);
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
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"имя категории"}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value={""}>нет родительской категории</option>
            {categories.map((category) => (
              <option key={`option-${category._id}`} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Свойства</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm mb-2"
          >
            Добавить новое свойство
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={`prop-${index}`} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="свойство (пример: цвет)"
                />
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  placeholder="значение свойства"
                />
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="btn-red"
                >
                  Удалить
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Отмена
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Сохранить
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
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
                      className="btn-default mr-1"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
