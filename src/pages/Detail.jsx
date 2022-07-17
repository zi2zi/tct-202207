import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Detail = () => {
  const param = useParams();
  console.log("param", param);

  const nv = useNavigate();

  const [list, setList] = useState();

  const makeList = (data) => {
    return (
      <div>
        <div
          style={{textAlign: "center", padding: "10px" }}
        >
          {data.title}
        </div>
        <div
          style={{ textAlign: "center", padding: "10px" }}
          > {data.singer}</div>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.5fr 1fr",
              gap: "1rem",
            }}
          >
            <div style={{ textAlign: "right" }}>작사</div>
            <div style={{ textAlign: "left" }}>
              {data.lyricist}
            </div>
            <div style={{ textAlign: "right" }}>작곡</div>
            <div style={{ textAlign: "left" }}>{data.melodizer}</div>
            <div style={{ textAlign: "right" }}>장르</div>
            <div style={{ textAlign: "left" }}>{data.genre}</div>
          </div>
        </div>
      </div>
    );
  };
 // http://localhost:3001/v1/chart/
  //axios
  useEffect(() => {
    console.log(1);
    axios.get(`http://localhost:3001/v1/chart/detail/${param.id}`).then((respose) => {
      console.log(respose?.data);
      if (respose?.data?.chart) {
        const listData = respose?.data?.chart;
        setList(makeList(listData));
      }
    });
  }, []);

  return (
    <div style={{   }}>
      <div
        style={{ padding: "10px" }}
        onClick={() => {
          nv("/");
        }}
      >
        {"<--"}
      </div>
      {list}
    </div>
  );
};

export default Detail;
