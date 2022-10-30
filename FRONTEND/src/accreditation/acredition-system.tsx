import { Box } from "@mantine/core";
import { Container, Image, Row } from "react-bootstrap";
import React, { useRef, useState } from "react";

export interface RegisteredAcc {
  id: string;
  nickname: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  rank: string;
  roomNumber: string | undefined;
  breakfast: boolean | undefined;
  fursuiter: boolean;
  tShirts: string[];
  additionalBadges: string[];
  image: string;
  checkedIn: boolean;
}

export const RegisteredAccEntry = (params: { acc: RegisteredAcc, clickCallback: (arg0: string) => void }) => {
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

export const GenerateList = (params: { data: RegisteredAcc[], setInput: (nickname: string) => void }) => {
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
const accountsTest = [{
  id: "26", nickname: "Z-Grate", name: "Grzegorz", surname: "Dzikowski",
  dateOfBirth: "15-02-2000",
  image: "https://lh3.googleusercontent.com/fife/AAbDypAHjFhwsBF50fhDl-INQynZJE0OJg6tWKT6noqO4BvXEnM5VMESkCXW_-wq0qhiJ0uHrClfyxWKvOT9KHyHm61SMt1EAssztrJjPGqxHwf7RiPrvOp739oQlR5RKxgQGexJieJzUcJ2JM6gTxsFTEJNCOaInBMjVTrRWui6ZNvx6g9snKQ5ruwsP6nbzbS-jFcz0QAtlQTC5pSTc2FQUg_e_m8F5A1UEmijHwa4t3yNWzQWEN0EQuSGxx2g_1u2sCC9uwj1Be5s6p5Im4pqQsE5Tx7RDmysYd5xWewZa4O11luhN40FHDVaP1boK5NJn7ABoWqwBLWb6JwIQ1iFC3LWUyhdQ2HmNDvfl8eFT5aGJf6VkzT4-Bu3OzF5Kib98gDR6GST0Ui9uqyZSeYZ0g_VyDCG3ju08ov1cdFXpBrTks1q744Xn7b3OZsRuX1veIheBZn9vgfae4lJZIOzP1usBTsn16OnrRlQfpyHKt2MZ-zmtUIxrOUeFWsg3HfKAx0-ZtCdSEUJrl4UJikn7i0dBHtV2Ww4RiFNum58tJh3uNNEbpV31NQ1b-lcSxFg2pJI0RU3TSXaatfaJA_wRuFrBKcGQuuU7LU2tzGxbYB_xUZ1QYoJn1KAJFimKA6dAvCazCLhD9yarPu9_90qrjlT7seHGSuTnarr2W7Y0ubYxffd_eadAAROUudxb0A2H_018rNLkqwimbsjaLQ93pdRsDx7uS9QkpCj1IP97Dbyo-44jDJXaSO_TqVXpiFZFfU_tN_Q7GZz_uv7_kguazLcUQX6V1GMUGU1M4rTSt9x9vtP3vjMl8G4Ctgej5441Pv4qJpDlP-VCnrt0oAYCrDuJolvTxN57iUCEocCig_ke8VQrbW4e84gNxzLbnyTVPWKxIViBIaXYtHhB4N7lIQ47-CTokaASQaqlAX8txPfoIU7lYXvDx4k1KZLoSCgOsxCsXrQkcElDXzctNnk2SAqfAHBhshhlSoa2oqerUSgedixiwVPTDVOS3zB5R8d2CEbATBYeJyWfmBwjUqk52u-m6Nn3Hwg9g2iqntGUnrpeWvl_5Os8iWEvUjmSx6JU5YJq4sHJTDYT-IDGw26ImCchzc0sNFrW5Pvu8_MlsoC_7nwHDPk_vF5fOeIz8RfZsWSK0ViAHvePOMAevRPmbizm4WnuVLOg4ufiRtCmXD5XDEDhu94z6hfZ_MC-cqxFvRKjkmnZiV5LDpTP7PJwOmuMV_0Xo000-x6Sqv87dPb921dRHO6C9PfbsEeHpNT8LxUHbQFcSW5t9tM_fHzxDm0uGuqnkR2DYEqMc-d8UpspMuyr7Owa0ZhmSFF9D6G7q0QT6KahFcfu1DVCGheImuqoACyn741r2xVYkvRxUkXYDuno6K10OyV2ZDtKkEoUNWYruJyNFBrBP9QEGLrBsBWxFFpHnB2Ut4Lq3SRzSxdk7FcD5QFVq-63a306tz8Uy5aZiDhIDO0bf71a0BhLkA2JR_1an3TePnJ7xh1vkg0iVdchW7sJgtaTfwPvvBEjgpBuqEXf2bKoJDPjbkZFWz26Rg4_DCa-HY5Wsm65869fsRsSohQ9SPl0EM=w1920-h890",
  rank: "Filantrop",
  roomNumber: "111",
  breakfast: true,
  fursuiter: true,
  tShirts: ["1 XXL", "ORG XXL"],
  additionalBadges: ["ORGANIZATOR", "MEDIA", "FURSUIT"],
  checkedIn: true

}
];
const UnwrapArray = (props: { list: string[] }) => {
  if (props.list.length === 0) {
    return <span>BRAK</span>;
  } else {
    return <div> {props.list.map((acc) => <span>{acc} </span>)}</div>;
  }
};

const CheckIn = (props: { checkIn: boolean }) => {
  if (props.checkIn) {
    return <div style={{ backgroundColor: "green" }}>JUŻ ZAMELDOWANY</div>;
  } else {
    return <></>;
  }
};

const CheckForKeys = (props: { keysCheck: boolean }) => {
  if (props.keysCheck) {
    return <div style={{ backgroundColor: "green" }}>KLUCZ WYDANY</div>;
  } else {
    return <></>;
  }
};

export const ShowBadge = (props: { acc: RegisteredAcc, checkForKeys: (room: string | undefined) => boolean, checkInKey: (id: string) => void }) => {
  return (
    <>
      <div style={{ fontSize: "3vh", display: "flex", flexDirection: "row", justifyContent: "center", margin: "20px" }}>
        <div>
          <Image style={{ position: "sticky" }} height={"500px"} src={props.acc.image} />
        </div>
        <div style={{ margin: "30px" }}>
          <CheckIn checkIn={props.acc.checkedIn} />
          <CheckForKeys keysCheck={props.checkForKeys(props.acc.roomNumber!)} />
          <div>
            {props.acc.id} - {props.acc.nickname}
          </div>
          <div>
            {props.acc.name} {props.acc.surname}
          </div>
          <div>
            {props.acc.dateOfBirth}
          </div>
          <div className={"MarginTop"}>
            <span
              style={{ backgroundColor: props.acc.roomNumber === undefined ? "red" : "green" }}>HOTEL: {props.acc.roomNumber === undefined ? "BRAK" : props.acc.roomNumber}</span>
          </div>
          <div className={"MarginTop"}>
            <span
              style={{ backgroundColor: props.acc.breakfast ? "green" : "red" }}>ŚNIADANIE: {props.acc.breakfast ? "TAK" : "NIE"}</span>
          </div>
          <div style={{ marginTop: "5px", backgroundColor: props.acc.additionalBadges.length === 0 ? "" : "green" }}>
            Dodatkowe badge:
            <UnwrapArray list={props.acc.additionalBadges} />
          </div>
          <div style={{ marginTop: "5px", backgroundColor: props.acc.tShirts.length === 0 ? "" : "green" }}>
            Koszulki:
            <UnwrapArray list={props.acc.tShirts} />
          </div>


        </div>


      </div>
      <button style={{ width: "50%", height: "100%", fontSize: "5vh" }}>CHECK IN</button>
    </>
  );
};
const CheckInValue = (id: string, listId: RegisteredAcc[]) => {
  return listId.find((value) => value.id === id)?.checkedIn;
};

export const GenerateListView = (props: { filter: string, list: RegisteredAcc[], setInput: (nickname: string) => void }) => {
  const f = props.filter.toLowerCase();
  const filteredList = props.list.filter((it) => it.nickname.toLowerCase().includes(f) || it.name.toLowerCase().includes(f) || it.surname.toLowerCase().includes(f) || it.id == (props.filter));
  if (filteredList.length > 4) {
    return <div style={{ fontSize: "5vh" }}>Podaj swoje wyszukiwanie!</div>;
  } else if (filteredList.length === 0) {
    return <div style={{ fontSize: "5vh" }}>Brak wyników!</div>;
  } else if (filteredList.length === 1) {
    return <ShowBadge acc={filteredList[0]} checkForKeys={(room) => {

      return room !== undefined && props.list.filter(it => it.roomNumber === room).some((value) => value.checkedIn);
    }} checkInKey={(id => CheckInValue(id, props.list))} />;
  } else {
    return <GenerateList data={filteredList} setInput={props.setInput} />;
  }

};

export const AcreditionSystem = () => {

  const [password, setPassword] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  if (password) {
    return <div className="App" style={{ alignItems: "center", justifyContent: "center" }}>
      <div>
        <b style={{ fontSize: "5vh" }}>SYSTEM AKREDYTACJI FUTROŁAJKI 2022</b>
      </div>
      <input ref={inputRef} type="text" height={"5vh"} style={{ height: "5vh", fontSize: "2vh", width: "40vw" }}
             onChange={(e) => setCurrentFilter(e.target.value)} />

      <GenerateListView filter={currentFilter} list={accountsTest}
                        setInput={(nickname) => inputRef.current!.value = nickname} />
      <Box>
      </Box>
    </div>;
  } else {
    return <div className="App" style={{ alignItems: "center", justifyContent: "center" }}>
      <input ref={passwordRef} type="text" height={"5vh"} style={{ height: "5vh", fontSize: "2vh", width: "40vw" }} />
      <button>ACCEPT</button>
    </div>;
  }
};
