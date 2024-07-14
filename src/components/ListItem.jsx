import { useState } from "react";
import formatDate from "../helpers/formatDate";
import axios from "axios";
import Content from "./Content";
import EditMode from "./EditMode";

const ListItem = ({ todo, setTodos, todos }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // silme butonuna tıklanınca çalışır
  const handleDelete = () => {
    // yapmak istediğimiz şey: veriyi api'den sil
    axios
      .delete(`/todos/${todo.id}`)
      // kullanıcının bu güncellemeyi görebilmesi için de veriyi state'den sil
      .then(() =>
        setTodos((todos) => todos.filter((item) => item.id !== todo.id))
      );
  };

  // form gönderilince çalışır
  const handleEdit = (e) => {
    e.preventDefault();

    //input'lardaki verileri al
    const newStatus = e.target[0].value;
    const newTitle = e.target[1].value;

    //api'deki ilgili todo'yu güncelle
    axios
      .patch(`/todos/${todo.id}`, {
        title: newTitle,
        status: newStatus,
      })
      // api isteği başarılı olursa arayüzü güncelle
      .then(() => {
        //todo'nun title ve status'unu güncelle
        const updated = { ...todo, status: newStatus, title: newTitle };

        //dizideki eski todoyu kaldır, yerine yenisini koy
        // eğer ki eleman güncellenecek eleman ise o zaman diziye güncel
        // halini "updated" ekle, değilse dizideki halini "todo" ekle.
        const newTodos = todos.map((todo) =>
          todo.id === updated.id ? updated : todo
        );

        // state'i güncelle
        setTodos(newTodos);
      });

    // gönderdiğim zaman düzenleme modu kapansın
    setIsEditMode(false);
  };

  return (
    <li className="relative p-3 list-group-item d-flex justify-content-between align-items-center gap-3">
      {!isEditMode ? (
        <Content
          todo={todo}
          setIsEditMode={setIsEditMode}
          handleDelete={handleDelete}
        />
      ) : (
        <EditMode
          todo={todo}
          setIsEditMode={setIsEditMode}
          handleEdit={handleEdit}
        />
      )}

      <span className="date">{formatDate(todo.date)}</span>
    </li>
  );
};

export default ListItem;
