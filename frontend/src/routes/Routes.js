import Home from "../pages/Home";

const publicRoutes = [
    // { path: "/login", component: Login, layout: null },
    // { path: "/register", component: Register, layout: null },
    // { path: "/forgotpassword", component: ForgotPassword, layout: null },
];

const privateRoutes = [{ path: "/", component: Home }];

export { publicRoutes, privateRoutes };
