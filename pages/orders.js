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
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
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
                  {order.name} {order.email} <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress} <br />
                  {order.phoneNumber} <br />
                  {order.phoneNumber && (
                    <Link href={`https://wa.me/${order.phoneNumber}`}></Link>
                  )}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <React.Fragment key={l.price_data?.product_data?.name}>
                      {l.price_data?.product_data?.name} x{l.quantity}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
