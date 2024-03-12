import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
require("dayjs/locale/kk");
dayjs.locale("kk");

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }

  async function deleteOrder(id) {
    await axios.delete(`/api/orders?id=${id}`);
    fetchOrders();
  }

  return (
    <Layout>
      <h1>Заказы</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Дата заказа</th>
            <th>Оплачено</th>
            <th>Клиент</th>
            <th>Товары</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{dayjs(order.createdAt).format("L LT")}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "ДА" : "НЕТ"}
                </td>
                <td>
                  {order.name} <br />
                  {order.email} <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress} <br />
                  {order.phoneNumber}
                  {order.phoneNumber && (
                    <Link
                      className="bg-green-600 text-white rounded-md"
                      href={`whatsapp://send?phone=${order.phoneNumber}`}
                      target="_self"
                    >
                      Написать whatsapp
                    </Link>
                  )}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <Link
                      href={`/products/edit/${l.price_data?.product_data?.id}`}
                      key={l.price_data?.product_data?.name}
                    >
                      {l.price_data?.product_data?.name} x{l.quantity}
                      <br />
                    </Link>
                  ))}
                </td>
                <td>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="border border-red-700 text-red-700 rounded-md p-1"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
