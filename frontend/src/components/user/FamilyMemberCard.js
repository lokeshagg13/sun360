// FamilyMemberCard.js
import React from "react";
import "./FamilyMemberCard.css";
import SkinColorPalette from "../basic-ui/elements/SkinColorPalette";

function FamilyMemberCard({ member, onChange }) {
  return (
    <div className="family-member-card">
      <h5 className="family-member-heading">Family Member {member.id}</h5>
      <div className="form-row">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={member.name}
          onChange={(e) =>
            onChange(member.id, { ...member, name: e.target.value })
          }
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
          value={member.age}
          onChange={(e) =>
            onChange(member.id, { ...member, age: e.target.value })
          }
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
          value={member.skinTone}
          onChange={(e) =>
            onChange(member.id, { ...member, skinTone: e.target.value })
          }
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
          value={member.gender}
          onChange={(e) =>
            onChange(member.id, { ...member, gender: e.target.value })
          }
        >
          <option value="">Select...</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <button
        type="button"
        className="remove-member"
        onClick={() => onChange(member.id, null)}
      >
        Remove
      </button>
    </div>
  );
}

export default FamilyMemberCard;
