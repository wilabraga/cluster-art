import React, {useContext, useState} from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from "react-bootstrap/FormControl";
import AttributeDropdown from "./attribute_dropdown";
import {AccordionContext, FormGroup} from "react-bootstrap";
import {Accordion} from "react-bootstrap";

import './customizational_panel.css';

export default function CustomizationPanel(props) {

    const [numArtworks, setNumArtworks] = useState(100);
    const [kValue, setkValue] = useState(5);
    const [customFeatures, setCustomFeatures] = useState(new Set(
        ["Title", "Creation Date", "Culture", "Collection", "Type", "Technique"]
    ));
    const [collapsed, setCollapsed] = useState(false);

    const validateParams = () => {
        if (numArtworks < 1 || numArtworks > 10000) {
            props.statusHandler(1);
            return false;
        }
        if (kValue < 2 || kValue > 25) {
            props.statusHandler(2);
            return false;
        }
        if (customFeatures.size < 2) {
            props.statusHandler(3);
            return false;
        }
        if (numArtworks < kValue) {
            props.statusHandler(4);
            return false;
        }
        props.statusHandler(0);
        return true;
    }

    const submitParams = () => {
        let validInput = validateParams();
        if (validInput) {
            props.loadingHandler(true);
            fetch('/time', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify([numArtworks, kValue, [...customFeatures]])
            }).then(res => res.json())
                .then(data => {
                    props.jsonHandler(data)
                    props.clusterHandler(kValue)
                    props.loadingHandler(false);
                })
        }
    }

    return (
        <Accordion id={"panel-container"} defaultActiveKey={0} flush className={collapsed ? "condensed" : "expanded"}>
            <Accordion.Item eventKey={0} onClick={() => setCollapsed(!collapsed)}>
                <Card>
                    <Accordion.Header> Customize Parameters </Accordion.Header>
                    <Accordion.Body>
                        <Card.Body>
                            <Form>
                                <FormGroup>
                                    <Card.Subtitle>
                                        Number of Artworks
                                    </Card.Subtitle>
                                    <FormControl
                                        type={"number"}
                                        onChange={(e) =>
                                            setNumArtworks(e.target.valueAsNumber)}
                                        defaultValue={numArtworks}
                                        min={100}
                                        max={10000}
                                        step={100}
                                    />
                                    <Card.Subtitle>
                                        Number of clusters (k)
                                    </Card.Subtitle>
                                    <FormControl
                                        type={"number"}
                                        onChange={(e) =>
                                            setkValue(e.target.valueAsNumber)}
                                        defaultValue={kValue}
                                        min={2}
                                        max={25}
                                    />
                                    <AttributeDropdown attributeHandler={setCustomFeatures}/>
                                    <Button style={{float: "right", "marginBottom": "24px"}} type={"button"}
                                            onClick={() => submitParams()}>
                                        Render
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Card.Body>
                    </Accordion.Body>
                </Card>
            </Accordion.Item>


        </Accordion>
    )
}

