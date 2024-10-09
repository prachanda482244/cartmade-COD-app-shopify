import React, { useState } from "react";
import { Page, Layout, Card, TextField, Icon } from "@shopify/polaris";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DragHandleIcon } from "@shopify/polaris-icons";

const initialFormFields = [
  { id: "firstName", label: "First Name", type: "text" },
  { id: "lastName", label: "Last Name", type: "text" },
  { id: "phoneNumber", label: "Phone Number", type: "text" },
  { id: "address", label: "Address", type: "text" },
  { id: "city", label: "City", type: "text" },
  { id: "zip", label: "Zip Code", type: "text" },
];

function App() {
  const [formFields, setFormFields] = useState(initialFormFields);

  // Handle Drag and Drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedFields = [...formFields];
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);

    setFormFields(reorderedFields);
  };

  return (
    <Page title="Form Builder">
      <Layout>
        {/* Left: Form Builder Section */}
        <Layout.Section variant="oneHalf">
          <Card>
            <h2>Customize your form</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-builder">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ minHeight: "300px" }}
                  >
                    {formFields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              userSelect: "none",
                              padding: 16,
                              margin: "0 0 8px 0",
                              background: snapshot.isDragging
                                ? "#e0f7fa"
                                : "#f9f9f9",
                              border: snapshot.isDragging
                                ? "2px solid #007acc"
                                : "1px solid #ccc",
                              display: "flex",
                              alignItems: "center",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {/* Drag Icon - Apply dragHandleProps here */}
                            <div
                              {...provided.dragHandleProps} // Move this here
                              style={{ marginRight: "10px", cursor: "grab" }}
                            >
                              <Icon source={DragHandleIcon} tone="primary" />
                            </div>

                            {/* Form Field Input */}
                            <Card>
                              <TextField
                                label={field.label}
                                value={field.label}
                                onChange={() => {}}
                                autoComplete="off"
                              />
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </Layout.Section>

        {/* Right: Live Preview Section */}
        <Layout.Section variant="oneHalf">
          <Card>
            <h2>Live Preview</h2>
            <form>
              {formFields.map((field) => (
                <Card key={field.id}>
                  <TextField
                    label={field.label}
                    onChange={() => {}}
                    autoComplete="off"
                  />
                </Card>
              ))}
            </form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default App;
