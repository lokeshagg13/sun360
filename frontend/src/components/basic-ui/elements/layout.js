import { Fragment } from "react";

import Navbar from "./Navbar";

import "./Layout.css";
import Acknowledgement from "./Acknowledgement";

// For basic layout of every app page
function Layout(props) {
  // Must always include navbar attached to the children around which the <Layout> component will be wrapped
  return (
    <Fragment>
      <Navbar />
      <main className="main">{props.children}</main>
      <Acknowledgement />
    </Fragment>
  );
}

export default Layout;
