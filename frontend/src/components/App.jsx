import Body from "./Body";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import { Provider } from "react-redux";
import appStore from "../utils/appStore";
import Feed from "./Feed";
import ProfileEdit from "./ProfileEdit";
import Connections from "./Connections";
import Request from "./Request";
import Chat from "./Chat";
import Home from "./Home";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Body />}>

            {/* Home page */}
            <Route index element={<Home />} />

            {/* Authentication */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Login />} />

            {/* Application pages */}
            <Route path="feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Request />} />
            <Route path="profile/edit" element={<ProfileEdit />} />
            <Route path="chat/:targetUserId" element={<Chat />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;