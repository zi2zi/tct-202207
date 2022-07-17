import styles from "./Main.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//const DELIVERY_FEE_LIMIT = 50000;
const Main = () => {


    //const [total, setTotal] = useState(0);
    //const [delivery, setDelivery] = useState(0);

    const [list, setList] = useState();
    const [domestic, setDomestic] = useState("domestic");
    const [originDataList, setOriginDataList] = useState();

    const [hkl, setHkl] = useState([]);

    const baseServiceUri = "http://localhost:3001/v1/chart/";
    let timeFormat = (new Date().getFullYear().toString()) + "년 "
        + (new Date().getUTCMonth() + 1).toString() + "월 "
        + (new Date().getUTCDate().toString()) + "일 "
        + (new Date().getUTCHours().toString()) + ":00 "



    const nv = useNavigate();

    // 검색창 Ref
    const keywordRef = useRef("");


    const makeList = (data) => {
        const result = data.map((item, index) => {
            return (
                <div key={index} style=
                    {{
                        display: 'subgrid', gap: '1rem', gridTemplateColumns: '1fr 1fr 3fr 2fr'
                        , placeItems: 'center', width: ''
                    }}>
                    {/* <div style={{display:'hidden'}}>{item.id}</div> */}
                    <div>{item.rank}</div>
                    <div><img style={{ width: '4rem', height: '4rem' }} src={`/images/${item.imageUrl}`} /></div>
                    <div onClick={() => nv(`/detail/${item.id}`)} style={{ marginRight: 'auto', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '10rem' }}>{item.title}</div>
                    <div style={{ textAlign: 'right', marginLeft: 'auto', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '6rem' }}>{item.singer}</div>
                </div>
            );
        });
        console.log(`result : ${result}`);

        return result;
    };

    const mainSearch = () => {
        const keyword = keywordRef.current.value;
        // const result = originDataList.filter(x => x.title.toLowerCase().includes(keyword)); 
        const result = originDataList.filter(x => {
            if (x.title.toLowerCase().includes(keyword.toLowerCase())) {
                return x;
            }
        });
        setList(makeList(result));
        addHistoryKeyword(keyword);
    };

    const addHistoryKeyword = (data) => {
        console.log('addHistoryKeyword');
        if (data !== '' && hkl.filter(x => x === data).length === 0) {
            // var tempArr = [...hkl, data];
            // localStorage.setItem('history', JSON.stringify(tempArr));
            setHkl((prev) => [...prev, data]);
        }
        console.log(hkl.join(','));
    }

    const removeHistoryKeyword = (data) => {
        console.log('removeHistoryKeyword');
        console.log(data);
        if (data !== '') {
            const result = hkl.filter(x => x !== data);
            setHkl(result);
            console.log('deleted');
        }

    }

    const clearHistoryKeyrod = () => {
        setHkl([]);
    }



    //axios
    ////////////////////////////         main call      //////////////////////////////

    useEffect(() => {
        console.log("dataCall start");

      /*   if (localStorage.getItem('history') !== null) {
            setHkl(JSON.parse(localStorage.getItem('history')));
        } */


        axios.get(baseServiceUri + domestic).then((respose) => {
            console.log(respose?.data);

            if (respose?.data?.chartList) {
                const listData = respose?.data?.chartList;
                //통신데이터 오리지날 저장
                setOriginDataList(listData);
                //메인화면 세팅
                let madeList = makeList(listData)
                console.log(madeList);
                setList(madeList);
            }


        });
    }, [domestic]);

    ///////////////////////////////////////////////////////////////////////////////////

   /*  useEffect(() => {
        const value = total > DELIVERY_FEE_LIMIT ? 0 : 3000;
        setDelivery(value);
      }, [total]); */


    // 검색창 onPress event
    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            mainSearch();
            keywordRef.current.value = '';
        }

    };


    //내림정렬
    const DescOrderBtn = () => {
        const descOrder = () => {
            const result = originDataList.sort(function (a, b) {
                // if(a.singer > b.singer) return -1;
                // if(a.singer < b.singer) return 1;
                // if(a.title > b.title) return -1;
                // if(a.title < b.title) return 1;


                // return 0;
                return a.title > b.title ? -1 : a.title < b.title ? 1 : 0;
            });
            setList(makeList(result));
        }

        return (
            <span onClick={descOrder}>내림정렬</span>
        );

    };

    //오름정렬
    const AscOrderBtn = () => {
        const ascOrder = () => {
            const result = originDataList.sort(function (a, b) {
                // if(a.singer > b.singer) return 1;
                // if(a.singer < b.singer) return -1;
                // if(a.title > b.title) return 1;
                // if(a.title < b.title) return -1;       
                // return 0;
                return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
            });
            setList(makeList(result));
        };

        return (
            <span onClick={ascOrder}>오름정렬</span>
        );
    };



    //   // 검색창 클릭 event
    //   const onClick = () => {
    //     // toggle 기능
    //     if (keyWordHistory.length > 0) {
    //       setHistoryShow(!historyShow);
    //     }
    //     setKeywordHistoryList(makeKeywordHistoryList(keyWordHistory));
    //   };


    //selectbox 예제
    const [currentOption, setCurrentOption] = useState('love')
    const SelectBox = () => {
        const selectBoxValueChange = (e) => {
            console.log("dong : " + e.target.value);
            keywordRef.current.value = e.target.value;
            mainSearch();
            setCurrentOption(e.target.value);
        }


        return <select value={currentOption} onChange={selectBoxValueChange}>
            <option key='1' value='cele' >cele</option>
            <option key='2' value='love' >love</option>
        </select>
    };


    return (
        <div className={styles.App}>
            <div className={styles.wrapper}>
                <div style={{ textAlign: "center" }}>
                    음악 차트
                </div>
                <div style={{ textAlign: "center" }}>
                    {timeFormat}
                </div>

                <div style={{ textAlign: "center" }}>
                    <input
                        ref={keywordRef}
                        type="text"
                        onKeyPress={onKeyPress}
                        //onClick={onClick}
                        // onChange={onChange}
                        placeholder="제목검색"
                    />
                    {/* <button onClick={search}>검색</button>        */}
                    <span onClick={mainSearch}>검색</span><span onClick={clearHistoryKeyrod}> 검색기록삭제</span>
                </div>
                <SelectBox />
                <div>
                    {hkl && (<span>{hkl.join(',')}</span>)}

                </div>
                <div>
                    {hkl && hkl.map((x, index) => {
                        return (
                            <div key={index}>
                                <span onClick={() => { keywordRef.current.value = x; mainSearch(); }}>{x}</span><span onClick={() => removeHistoryKeyword(x)}>__X__</span>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <span onClick={() => setDomestic("domestic")} style={domestic === 'domestic' ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>국내</span>
                    <span onClick={() => setDomestic("overseas")} style={domestic !== 'domestic' ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>해외</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    {/* {domestic} */}
                    {list}
                </div>
            </div>
        </div>


    );
};


export default Main;