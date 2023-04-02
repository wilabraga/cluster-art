import React, {useState} from 'react';
import CustomizationPanel from "./components/customization_panel";
import './kmeans.css';
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {CircleLoader} from "react-spinners";
import {css} from "@emotion/react"

export default function KMeans(props) {

    const [status, setStatus] = useState(0);
    const errorMessages = [
        "",
        "Please enter a valid number of art works (2-30000).",
        "Please enter a valid number of clusters (2-30).",
        "Please choose at least 2 attributes for clustering."
    ]
    const [isLoading, setIsLoading] = useState(false);
    const override = css`
      display: block;
      margin: 24px auto;
    `

    return (
        <div>
            <CustomizationPanel
                id={"panel-wrapper"}
                statusHandler={setStatus}
                jsonHandler={props.jsonHandler}
                clusterHandler={props.clusterHandler}
                loadingHandler={setIsLoading}
            />

            <Modal id={"loader"} show={isLoading} backdrop={"static"}>
                Loading, please wait...
                <CircleLoader className={"loading-asset"} color={"#B3A369"} loading={isLoading} css={override} />
            </Modal>

            <Modal show={status !== 0} onHide={() => setStatus(0)}>
                <Modal.Header closeButton={true}>
                    <Modal.Title> Invalid input. </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessages[status]}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setStatus(0)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}