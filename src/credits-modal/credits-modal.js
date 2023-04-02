import React from 'react'
import {Button, Modal} from "react-bootstrap";
import './credits-modal.css'

export default function CreditsModal(props) {

    return (
        <Modal id={"credits-modal"} show={props.show} onHide={props.onHide} size={"lg"}
               centered={true} aria-labelledby={"contained-modal-title-vcenter"}>

            <div className={"credits-modal-contents"}>

                <h1 id={"credits-header"}>
                    Credits
                </h1>

                <ul>
                    <li>
                        William Braga (back-end, ML engineer, data processing)
                    </li>
                    <li>
                        Harshal Dahake (back-end, schema configuration)
                    </li>
                    <li>
                        Kewal Khatiwala (back-end, data processing)
                    </li>
                    <li>
                        Hannah Li (front-end)
                    </li>
                    <li>
                        Sidney Miller (data processing, presentation)
                    </li>
                    <li>
                        Aditya Tapshalkar (front-end, back-end)
                    </li>
                </ul>

                <div style={{textAlign: "center"}}>
                    <Button className={"modal-okay-button"} type={"button"} onClick={props.onHide}>
                        Close
                    </Button>
                </div>

            </div>



        </Modal>
    )

}