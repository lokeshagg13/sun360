// RegisterPage.js
import React, { useState } from "react";
import axios from "axios";

import SkinColorPalette from "../basic-ui/elements/SkinColorPalette";
import FamilyMemberCard from "./FamilyMemberCard";

import "./Register.css";

const REGISTER_URL = "http://127.0.0.1:5000/users";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(18);
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [skinTone, setSkinTone] = useState(0);
  const [gender, setGender] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(null);
  const [registerRemarks, setRegisterRemarks] = useState("");

  const handleFamilyMemberChange = (id, member) => {
    if (id === familyMembers.length + 1) {
      // New Member added
      setFamilyMembers([
        ...familyMembers,
        {
          id: familyMembers.length + 1,
          name: "",
          gender: "",
          age: 10,
          skinTone: 0,
        },
      ]);
    } else if (member === null) {
      // Current member removed
      const updatedMembers = familyMembers.filter((m) => m.id !== id);
      for (let i = 1; i <= updatedMembers.length; i += 1) {
        updatedMembers[i - 1].id = i;
      }
      console.log(updatedMembers);
      setFamilyMembers(updatedMembers);
    } else {
      // Current member value changed
      const updatedMembers = familyMembers.map((m) =>
        m.id === id ? member : m
      );
      setFamilyMembers(
        updatedMembers.filter((m) => m.name || m.gender || m.age || m.skinTone)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setRegisterStatus('e')
      setRegisterRemarks("Passwords do not match");
      return;
    }

    try {
      setRegisterStatus('p')
      setRegisterRemarks("Registering your details");
      
      await axios.post(
        REGISTER_URL,
        JSON.stringify({
          users_name: name,
          users_email: email,
          users_password: password,
          users_age: age,
          users_skin_type: skinTone,
          users_gender: gender,
          suburb_name: suburb,
          suburb_postcode: postcode,
          users_family_members: [
            ...familyMembers.map((member) => ({
              fm_name: member.name,
              fm_age: member.age,
              fm_gender: member.gender,
              fm_skin_type: member.skinTone,
            })),
          ],
        }),
        {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Credentials": true },
          withCredentials: true,
        }
      );

      setRegisterStatus('s')
      setRegisterRemarks("Registration successful. Please proceed to login.");
      
    } catch (error) {
      console.error("Registration Error:", error);
      setRegisterStatus('e')
      setRegisterRemarks("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-row">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="cpassword"
            id="cpassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            name="age"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="suburb" className="form-label">
            Suburb
          </label>
          <input
            type="text"
            name="suburb"
            id="suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="postcode" className="form-label">
            Postcode
          </label>
          <input
            type="text"
            name="postcode"
            id="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <div className="form-row skin-tone">
          <label htmlFor="skintone" className="form-label">
            Skin Tone
          </label>
          <input
            type="range"
            name="skintone"
            id="skintone"
            min="0"
            max="9"
            value={skinTone}
            onChange={(e) => setSkinTone(parseInt(e.target.value))}
          />
          <SkinColorPalette />
        </div>
        <div className="form-row">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="form-row">
          {familyMembers.length > 0 && (
            <label htmlFor="familyMembers" className="form-label">
              Family Members
            </label>
          )}
          {familyMembers.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              onChange={handleFamilyMemberChange}
            />
          ))}
        </div>
        <button
          type="button"
          className="add-member"
          onClick={() =>
            handleFamilyMemberChange(familyMembers.length + 1, {
              id: familyMembers.length + 1,
              name: "",
              gender: "",
              age: 10,
              skinTone: 0,
            })
          }
        >
          Add Family Member
        </button>

        {registerStatus === "s" && <p className="success-message">{registerRemarks}</p>}
        {registerStatus === "p" && <p className="pending-message">{registerRemarks}</p>}
        {registerStatus === "e" && <p className="error-message">{registerRemarks}</p>}
      
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
