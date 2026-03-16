import { Line } from "@ant-design/charts";

const data = [
  { year: "2021", value: 3 },
  { year: "2022", value: 4 },
  { year: "2023", value: 3.5 },
  { year: "2024", value: 5 },
];

export default function CustomerTodayChart() {
  const config = {
    data,
    xField: "year",
    yField: "value",
    height: 400,
  };
  return <Line {...config} />;
}
