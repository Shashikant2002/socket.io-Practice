import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../config";
import "./styles/App.css";
import { io } from "socket.io-client";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";

function App() {
  const socket = useMemo(() => io(baseUrl), []);

  const [socketId, setSocketId] = useState("");

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");

  const [messArr, setMessArr] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });
    socket.on("welcome", (data) => {
      console.log(data);
    });
    socket.on("userConnect", (data) => {
      console.log(data);
    });

    socket.on("messageBroadReceived", (data) => {
      console.log(data);
    });

    socket.on("messageReceived", (data) => {
      console.log(data);
      setMessArr((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onSendMessage = () => {
    try {
      // socket.emit("messageBroad", message);
      socket.emit("message", { message, room });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <h2>Socket ID: ={socketId}</h2>
          <TextField
            type="text"
            label={"Enter Room"}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth={true}
          />
          <TextField
            type="text"
            label={"Enter Message"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth={true}
          />
          <Button
            variant="contained"
            size="large"
            onClick={onSendMessage}
            fullWidth={true}
          >
            Send Message
          </Button>

          <div className="messages" style={{ width: "100%" }}>
            <List fullWidth={true}>
              {messArr?.map((ele) => {
                return (
                  <ListItem disablePadding fullWidth={true}>
                    <ListItemButton fullWidth={true}>
                      <ListItemText primary={ele} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
      </Container>
    </>
  );
}

export default App;
