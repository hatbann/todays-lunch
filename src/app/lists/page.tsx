/** @format */
"use client";

import { SampleType } from "@/model/sample";
import React, { useEffect, useState } from "react";

const page = () => {
  const [samples, setSamples] = useState<SampleType[]>([]);

  useEffect(() => {
    const getSamples = async () => {
      const API_URL =
        process.env.NODE_ENV === "production"
          ? "/api"
          : `${process.env.NEXT_PUBLIC_API_URL!}/api`;
      const response = await fetch(`${API_URL}/lists`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          console.log(e);
        });
      setSamples(response);
    };

    getSamples();
  }, []);

  return (
    <div>
      {samples.map((sample, idx) => {
        return (
          <div>
            <p>{sample.title}</p>
            <img src={sample.img ?? ""} alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default page;
