import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/kk"; // load on demand
dayjs.locale("kk"); // use Spanish locale globally

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
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{dayjs(order.createdAt).format("L LT")}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
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
