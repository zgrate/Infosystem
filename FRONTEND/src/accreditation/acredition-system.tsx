import { Box } from "@mantine/core";
import { Container, Image, Row } from "react-bootstrap";
import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { RegisteredAcc } from "./accredition";
import { axiosService } from "../services/AxiosService";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

// export interface RegisteredAcc {
//   id: string;
//   nickname: string;
//   name: string;
//   surname: string;
//   dateOfBirth: string;
//   rank: string;
//   roomNumber: string | undefined;
//   breakfast: boolean | undefined;
//   fursuiter: boolean;
//   tShirts: string[];
//   additionalBadges: string[];
//   image: string;
//   checkedIn: boolean;
// }

export interface PartialAccreditation {
  id: number;
  nickname: string;
  name: string;
  surname: string;
}

export const RegisteredAccEntry = (params: { acc: PartialAccreditation, clickCallback: (arg0: string) => void }) => {
  return (
    <Box sx={() => ({
      overflow: "hidden",
      borderRadius: "8px",
      border: `4px solid black`,
      boxShadow: "2px",
      backgroundColor: "grey",
      margin: "20px",
      padding: "20px"
    })}>
      <Container>
        <Row onClick={(e) => params.clickCallback(params.acc.nickname)}>
          <span style={{ marginRight: "20px" }}>{params.acc.id}</span>
          <span style={{ marginRight: "20px" }}>{params.acc.name} {params.acc.surname}</span>
          {params.acc.nickname}
        </Row>
      </Container>
    </Box>);
};

export const GenerateList = (params: { data: PartialAccreditation[], setInput: (nickname: string) => void }) => {
  return <Container style={{ textAlign: "center", fontSize: "5vh" }}>
    {
      params.data.map((it) => {
        return (
          <Row style={{
            display: "flex",
            width: "100%",
            margin: "0 auto",
            justifyContent: "center"
          }}>
            <RegisteredAccEntry acc={it} clickCallback={(nickname: string) => params.setInput(nickname)} />
          </Row>
        );
      })
    }

  </Container>;
};
// const accountsTest = [{
//   id: "26", nickname: "Z-Grate", name: "Grzegorz", surname: "Dzikowski",
//   dateOfBirth: "15-02-2000",
//   image: "https://lh3.googleusercontent.com/fife/AAbDypAHjFhwsBF50fhDl-INQynZJE0OJg6tWKT6noqO4BvXEnM5VMESkCXW_-wq0qhiJ0uHrClfyxWKvOT9KHyHm61SMt1EAssztrJjPGqxHwf7RiPrvOp739oQlR5RKxgQGexJieJzUcJ2JM6gTxsFTEJNCOaInBMjVTrRWui6ZNvx6g9snKQ5ruwsP6nbzbS-jFcz0QAtlQTC5pSTc2FQUg_e_m8F5A1UEmijHwa4t3yNWzQWEN0EQuSGxx2g_1u2sCC9uwj1Be5s6p5Im4pqQsE5Tx7RDmysYd5xWewZa4O11luhN40FHDVaP1boK5NJn7ABoWqwBLWb6JwIQ1iFC3LWUyhdQ2HmNDvfl8eFT5aGJf6VkzT4-Bu3OzF5Kib98gDR6GST0Ui9uqyZSeYZ0g_VyDCG3ju08ov1cdFXpBrTks1q744Xn7b3OZsRuX1veIheBZn9vgfae4lJZIOzP1usBTsn16OnrRlQfpyHKt2MZ-zmtUIxrOUeFWsg3HfKAx0-ZtCdSEUJrl4UJikn7i0dBHtV2Ww4RiFNum58tJh3uNNEbpV31NQ1b-lcSxFg2pJI0RU3TSXaatfaJA_wRuFrBKcGQuuU7LU2tzGxbYB_xUZ1QYoJn1KAJFimKA6dAvCazCLhD9yarPu9_90qrjlT7seHGSuTnarr2W7Y0ubYxffd_eadAAROUudxb0A2H_018rNLkqwimbsjaLQ93pdRsDx7uS9QkpCj1IP97Dbyo-44jDJXaSO_TqVXpiFZFfU_tN_Q7GZz_uv7_kguazLcUQX6V1GMUGU1M4rTSt9x9vtP3vjMl8G4Ctgej5441Pv4qJpDlP-VCnrt0oAYCrDuJolvTxN57iUCEocCig_ke8VQrbW4e84gNxzLbnyTVPWKxIViBIaXYtHhB4N7lIQ47-CTokaASQaqlAX8txPfoIU7lYXvDx4k1KZLoSCgOsxCsXrQkcElDXzctNnk2SAqfAHBhshhlSoa2oqerUSgedixiwVPTDVOS3zB5R8d2CEbATBYeJyWfmBwjUqk52u-m6Nn3Hwg9g2iqntGUnrpeWvl_5Os8iWEvUjmSx6JU5YJq4sHJTDYT-IDGw26ImCchzc0sNFrW5Pvu8_MlsoC_7nwHDPk_vF5fOeIz8RfZsWSK0ViAHvePOMAevRPmbizm4WnuVLOg4ufiRtCmXD5XDEDhu94z6hfZ_MC-cqxFvRKjkmnZiV5LDpTP7PJwOmuMV_0Xo000-x6Sqv87dPb921dRHO6C9PfbsEeHpNT8LxUHbQFcSW5t9tM_fHzxDm0uGuqnkR2DYEqMc-d8UpspMuyr7Owa0ZhmSFF9D6G7q0QT6KahFcfu1DVCGheImuqoACyn741r2xVYkvRxUkXYDuno6K10OyV2ZDtKkEoUNWYruJyNFBrBP9QEGLrBsBWxFFpHnB2Ut4Lq3SRzSxdk7FcD5QFVq-63a306tz8Uy5aZiDhIDO0bf71a0BhLkA2JR_1an3TePnJ7xh1vkg0iVdchW7sJgtaTfwPvvBEjgpBuqEXf2bKoJDPjbkZFWz26Rg4_DCa-HY5Wsm65869fsRsSohQ9SPl0EM=w1920-h890",
//   rank: "Filantrop",
//   roomNumber: "111",
//   breakfast: true,
//   fursuiter: true,
//   tShirts: ["1 XXL", "ORG XXL"],
//   additionalBadges: ["ORGANIZATOR", "MEDIA", "FURSUIT"],
//   checkedIn: true
//
// }
// ];
const UnwrapArray = (props: { list: string[] }) => {
  if (props.list.length === 0) {
    return <span> BRAK </span>;
  } else {
    return <div> |{props.list.map((acc) => <span> {acc} |</span>)}</div>;
  }
};

const CheckIn = (props: { checkIn: boolean }) => {
  if (props.checkIn) {
    return <div style={{ backgroundColor: "green" }}>JUŻ ZAMELDOWANY</div>;
  } else {
    return <></>;
  }
};

const CheckForKeys = (props: { acc: RegisteredAcc }) => {
  if (props.acc && props.acc.roomNumber) {
    if (props.acc.keysFree) {
      return <div style={{ backgroundColor: "green" }}>KLUCZ DO WYDANIA</div>;
    } else {
      return <div style={{ backgroundColor: "red" }}>KLUCZ WYDANY</div>;
    }
  } else {
    return <></>;
  }
};

const PaymentInfo = (props: { acc: RegisteredAcc }) => {

  if (props.acc.outStandingPaymentAccreditation > 0) {
    if (props.acc.outStandingPaymentHotel !== undefined && props.acc.outStandingPaymentHotel > 0) {
      return <div>
        <div>
          Zaległość: Akredytacja {props.acc.outStandingPaymentAccreditation}
        </div>
        <div>
          Zaległość: Hotel {props.acc.outStandingPaymentHotel}
        </div>
      </div>;
    } else {
      return <div>
        Zaległość: Akredytacja {props.acc.outStandingPaymentAccreditation}
      </div>;
    }
  } else {
    return <></>;
  }
};

export const TypeInfo = (props: { acc: RegisteredAcc }) => {
  if (props.acc.planSelected === 100) {
    return <div>Uczestnik</div>;
  } else if (props.acc.planSelected === 150) {
    return <div style={{ backgroundColor: "violet" }}>Sponsor</div>;
  } else if (props.acc.planSelected === 200) {
    return <div style={{ backgroundColor: "gold" }}>Filantrop</div>;
  } else {
    return <div>INVALID PLAN SELECTED {props.acc.planSelected}</div>;
  }
};

export const ShowBadge = (props: { acc: RegisteredAcc, checkInKey: (id: number) => void }) => {
  const img = "https://res.futrolajki.pl/badge/" + props.acc.id + ".jpg";
  return (
    <>
      <div style={{ fontSize: "1em", display: "flex", flexDirection: "row", justifyContent: "center", margin: "20px" }}>
        <div>
          <Image style={{ position: "sticky" }} height={"400px"} src={img} />
        </div>
        <div style={{ marginLeft: "30px", backgroundColor: "aquamarine"}}>
          <CheckIn checkIn={props.acc.checkIn} />
          <CheckForKeys acc={props.acc} />
          <TypeInfo acc={props.acc} />
          <div>
            {props.acc.id} - {props.acc.nickname}
          </div>
          <div>
            {props.acc.name} {props.acc.surname}
          </div>
          <div>
            {props.acc.birthDate}
          </div>
          <div className={"MarginTop"}>
            <span
              style={{ backgroundColor: props.acc.roomNumber === undefined ? "red" : "green" }}>HOTEL: {props.acc.roomNumber === undefined ? "BRAK" : props.acc.roomNumber}</span>
          </div>
          <div className={"MarginTop"}>
            <span
              style={{ backgroundColor: props.acc.breakfast ? "green" : "red" }}>ŚNIADANIE: {props.acc.breakfast ? "TAK" : "NIE"}</span>
          </div>
          <div className={"MarginTop"}>
            <span
              style={{ backgroundColor: props.acc.top100 ? "green" : "red" }}>TOP 100: {props.acc.top100 ? "TAK" : "NIE"}</span>
          </div>
          <div style={{ marginTop: "5px", backgroundColor: props.acc.badges.length === 0 ? "" : "green" }}>
            Dodatkowe badge:
            <UnwrapArray list={props.acc.badges} />
          </div>
          <div style={{ marginTop: "5px", backgroundColor: props.acc.tshirts.length === 0 ? "" : "green" }}>
            Koszulki:
            <UnwrapArray list={props.acc.tshirts} />
          </div>
          <div className={"MarginTop"}>
            <span>Dodatkowe Informacje: {props.acc.additionalInfo === null ? "NIE" : props.acc.additionalInfo}</span>
          </div>
          <div className={"MarginTop"}>
            <div>Wybrana: {props.acc.planSelected}</div>

          </div>
          <PaymentInfo acc={props.acc} />
        </div>


      </div>
      <button onClick={(e) => {
        console.log("print");
        props.checkInKey(props.acc.id);
      }} style={{ width: "50%", height: "100%", fontSize: "5vh" }}>CHECK IN
      </button>
    </>
  );
};
const CheckInValue = (id: number, listId: RegisteredAcc[]) => {
  return listId.find((value) => value.id === id)?.checkIn;
};

export const GenerateListView = (props: { list: PartialAccreditation[], setInput: (nickname: string) => void }) => {

  if (props.list.length > 5) {
    return <div style={{ fontSize: "5vh" }}>Podaj swoje wyszukiwanie!</div>;
  } else if (props.list.length === 0) {
    return <div style={{ fontSize: "5vh" }}>Brak wyników!</div>;
  } else {
    return <GenerateList data={props.list} setInput={props.setInput} />;
  }

};

export const InternalAccreditationSystem = (params: { inputRef: RefObject<HTMLInputElement>, filter: string, accounts: PartialAccreditation[], setFilter: (string: string) => void }) => {

  const [badge, setBadge] = useState<RegisteredAcc>();

  const [loading, setLoading] = useState(false);

  const f = params.filter.toLowerCase();
  const filteredList = params.accounts.filter((it) => (it.name.toLowerCase() + " " + it.surname.toLowerCase()).includes(f) || it.nickname.toLowerCase().includes(f) || it.name.toLowerCase().includes(f) || it.surname.toLowerCase().includes(f) || it.id.toString() === (f));

  useEffect(() =>{
    if(filteredList.length === 1 && (badge === undefined || filteredList[0].id !== badge.id)){
      axiosService.get("accreditation/items/" + filteredList[0].id).then((bdg) => {
        setBadge(bdg.data);
      });
    }
  })
  if (filteredList.length === 1) {
    if (badge === undefined) {
      return <div>LOADING</div>;
    } else {
      return <>
        <ShowBadge acc={badge} checkInKey={(id) => {
          axiosService.post("accreditation/checkin/" + id).then(it => {
            if (it.data) {
              params.setFilter("");
            } else {
              toast("Check in error! Try Again...");
            }
          });
        }
        } />
      </>;
    }
  } else {
    if (badge !== undefined) {
      setBadge(undefined);
    }
    return (<>

        <GenerateListView list={filteredList}
                          setInput={(nickname) => params.setFilter(nickname)} />
      </>
    );
  }
  return <div>WHEN?</div>;

};

export const AcreditionSystem = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");

  const [accounts, setAccounts] = useState<PartialAccreditation[]>([]);
  const [error, setError] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);

  const debouncedChangeHandler = useCallback(
    debounce(()=>{
      setCurrentFilter(inputRef.current!.value)
    }, 350)
    , [inputRef]);

  useEffect(() => {

    const refreshData = () => {
      axiosService.get("/accreditation/items").then((response) => {
        setAccounts(response.data);
      }).catch(it => setError(true));
    }

    if(password){
      refreshData()
    }

    return ()=>{
      debouncedChangeHandler.cancel()
    }
  }, [password])

  if (error) {
    return <div>INVALID PASSWORD,REFRESH THE SITE</div>;
  }

  if (password && accounts.length != 0) {
    return <div className="App">
      <div>
        <b style={{ fontSize: "5vh" }}>SYSTEM AKREDYTACJI FUTROŁAJKI 2022</b>
      </div>
      <input ref={inputRef} type="text" height={"5vh"}
             style={{ height: "5vh", fontSize: "2vh", width: "40vw" }}
             onChange={(e) =>
             {
               debouncedChangeHandler()
             }}
             onKeyDown={(e) => {

               if (e.key === "enter")
                 setCurrentFilter(inputRef.current!.value);
             }
             }

      />
      <InternalAccreditationSystem setFilter={(it) => {

        setCurrentFilter(it);
      }
      } inputRef={inputRef} filter={currentFilter} accounts={accounts} />

      <Box>
      </Box>
    </div>;
  } else {
    return <div className="App">
      <input ref={passwordRef} type="password" height={"5vh"}
             style={{ height: "5vh", fontSize: "2vh", width: "40vw" }} />
      <button onClick={() => {
        setPassword(passwordRef.current!.value);
        axiosService.defaults.headers.common["Authorization"] = "Bearer " + passwordRef.current!.value;
      }
      }>ACCEPT
      </button>
    </div>;
  }
};
