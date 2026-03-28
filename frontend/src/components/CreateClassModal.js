import React from "react";
import { useState } from "react";
import { createClass } from "../services/classService";
import "./css/CreateClassModal.css";
function CreateClassModal({onClose, onClassCreated}){

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        horario: "",
        duracion: "",
        capacidad_maxima: "",
        activa: true
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const newClass = await createClass(formData);
            onClassCreated(newClass);
            onClose();

        }catch(err){
            console.error("Error creando la clase", err);

        }
    }
    return(
        <div className= "modal-overlay">
            <div className = "modal">

                <h1>Crear Nueva Clase
                </h1>
                <form onSubmit= {handleSubmit}>
                    <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre de la clase"
                    value={formData.nombre}
                    onChange={handleChange}
                    />
                    <textarea
                    name="descripcion"
                    placeholder="Descripción de la clase"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    />
                    <input
                       type="datetime-local"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    required
          />
                    <input
                    type="number"
                    name="duracion"
                    placeholder="Duración de la clase"
                    value={formData.duracion}
                    onChange={handleChange}
                    required
                    />
                    <input
                    type="number"
                    name="capacidad_maxima"
                    placeholder="Capacidad máxima"
                    value={formData.capacidad_maxima}
                    onChange={handleChange}
                    required
                    />
                    
                    <div className= "modal-buttons">
                        <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                     <button type="submit" className="save-button">Guardar</button>
                    </div>
                </form>
                
                 </div>

        </div>
    )
}
export default CreateClassModal;