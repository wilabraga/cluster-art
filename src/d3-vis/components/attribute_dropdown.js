import React, {useState} from 'react';
import './attribute_dropdown.css';
import {Accordion, Form, FormGroup} from "react-bootstrap";

export default function AttributeDropdown(props) {

    const allAttrs = ["Title", "Creation Date", "Culture", "Collection", "Type", "Technique"]
    const [customAttributes, setCustomAttributes] = useState(new Set(
        allAttrs
    ));

    const handleChange = (attr) => {
        let attr_copy = customAttributes;
        if (attr_copy.delete(attr)) {
            setCustomAttributes(attr_copy);
        } else {
            setCustomAttributes(attr_copy.add(attr));
        }
        props.attributeHandler(customAttributes);
    }

    return (
        <Accordion className={"accordion"} flush>
            <Accordion.Item eventKey={0}>
                <Accordion.Header> Clustering Attributes </Accordion.Header>
                <Accordion.Body>
                    <FormGroup>

                        {allAttrs.map(attr => <Form.Check
                            key={attr}
                            label={attr}
                            defaultChecked={customAttributes.has(attr)}
                            onChange={() => handleChange(attr)}
                        />)}

                    </FormGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}