"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewYouthPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        birthDate: "",
        sex: "",
        phoneNumber: "",
        address: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function updateField(
        field: keyof typeof form,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            if (!form.firstName.trim()) {
                setError("First name is required.");
                setSaving(false);
                return;
            }

            if (!form.lastName.trim()) {
                setError("Last name is required.");
                setSaving(false);
                return;
            }

            if (!form.email.trim()) {
                setError("Email address is required.");
                setSaving(false);
                return;
            }

            if (!form.password) {
                setError("Password is required.");
                setSaving(false);
                return;
            }

            if (form.password.length < 6) {
                setError(
                    "Password must be at least 6 characters."
                );
                setSaving(false);
                return;
            }

            const response = await fetch("/api/youth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: form.firstName.trim(),
                    middleName:
                        form.middleName.trim() || null,
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    birthDate:
                        form.birthDate || null,
                    sex: form.sex || null,
                    phoneNumber:
                        form.phoneNumber.trim() || null,
                    address:
                        form.address.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Unable to create youth account."
                );
                return;
            }

            setSuccess(
                "Youth account created successfully."
            );

            setTimeout(() => {
                router.push("/admin/youth");
                router.refresh();
            }, 800);
        } catch (error) {
            console.error(
                "Create youth error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main
            style={{
                maxWidth: "850px",
                margin: "0 auto",
                paddingBottom: "40px",
            }}
        >
            {/* Header */}
            <section
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "28px",
                }}
            >
                <div>
                    <p
                        style={{
                            margin: "0 0 6px",
                            color: "#166534",
                            fontSize: "13px",
                            fontWeight: 700,
                            textTransform:
                                "uppercase",
                            letterSpacing:
                                "0.08em",
                        }}
                    >
                        Youth Management
                    </p>

                    <h1
                        style={{
                            margin: "0 0 8px",
                            fontSize: "32px",
                            lineHeight: 1.2,
                            color: "#172033",
                        }}
                    >
                        Add Youth
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                        }}
                    >
                        Register a new youth member.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/youth"
                        )
                    }
                    style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border:
                            "1px solid #dbe3ea",
                        background: "#ffffff",
                        color: "#334155",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    ← Back to Youth
                </button>
            </section>

            {/* Error */}
            {error && (
                <div
                    style={{
                        padding: "14px 16px",
                        marginBottom: "20px",
                        background: "#fef2f2",
                        border:
                            "1px solid #fecaca",
                        borderRadius: "10px",
                        color: "#b91c1c",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div
                    style={{
                        padding: "14px 16px",
                        marginBottom: "20px",
                        background: "#f0fdf4",
                        border:
                            "1px solid #bbf7d0",
                        borderRadius: "10px",
                        color: "#166534",
                    }}
                >
                    {success}
                </div>
            )}

            {/* Form */}
            <section
                style={{
                    background: "#ffffff",
                    border:
                        "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "28px",
                    boxShadow:
                        "0 2px 8px rgba(15, 23, 42, 0.04)",
                }}
            >
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        <h2
                            style={{
                                margin:
                                    "0 0 6px",
                                fontSize: "19px",
                                color: "#172033",
                            }}
                        >
                            Personal Information
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#64748b",
                            }}
                        >
                            Enter the basic
                            information of the
                            youth member.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "18px",
                        }}
                    >
                        <FormField
                            label="First Name"
                            value={
                                form.firstName
                            }
                            required
                            onChange={(value) =>
                                updateField(
                                    "firstName",
                                    value
                                )
                            }
                        />

                        <FormField
                            label="Middle Name"
                            value={
                                form.middleName
                            }
                            onChange={(value) =>
                                updateField(
                                    "middleName",
                                    value
                                )
                            }
                        />

                        <FormField
                            label="Last Name"
                            value={
                                form.lastName
                            }
                            required
                            onChange={(value) =>
                                updateField(
                                    "lastName",
                                    value
                                )
                            }
                        />

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Birth Date
                            </label>

                            <input
                                type="date"
                                value={
                                    form.birthDate
                                }
                                onChange={(event) =>
                                    updateField(
                                        "birthDate",
                                        event.target
                                            .value
                                    )
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Sex
                            </label>

                            <select
                                value={form.sex}
                                onChange={(event) =>
                                    updateField(
                                        "sex",
                                        event.target
                                            .value
                                    )
                                }
                                style={
                                    inputStyle
                                }
                            >
                                <option value="">
                                    Select
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>
                            </select>
                        </div>

                        <FormField
                            label="Phone Number"
                            value={
                                form.phoneNumber
                            }
                            onChange={(value) =>
                                updateField(
                                    "phoneNumber",
                                    value
                                )
                            }
                        />
                    </div>

                    {/* Account Information */}
                    <div
                        style={{
                            marginTop: "32px",
                            marginBottom: "20px",
                        }}
                    >
                        <h2
                            style={{
                                margin:
                                    "0 0 6px",
                                fontSize: "19px",
                                color: "#172033",
                            }}
                        >
                            Account Information
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#64748b",
                            }}
                        >
                            Create the login
                            account for this
                            youth member.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "18px",
                        }}
                    >
                        <FormField
                            label="Email Address"
                            type="email"
                            value={form.email}
                            required
                            onChange={(value) =>
                                updateField(
                                    "email",
                                    value
                                )
                            }
                        />

                        <FormField
                            label="Password"
                            type="password"
                            value={
                                form.password
                            }
                            required
                            onChange={(value) =>
                                updateField(
                                    "password",
                                    value
                                )
                            }
                        />
                    </div>

                    <p
                        style={{
                            margin:
                                "8px 0 0",
                            fontSize: "12px",
                            color: "#94a3b8",
                        }}
                    >
                        Password must be at least
                        6 characters.
                    </p>

                    {/* Address */}
                    <div
                        style={{
                            marginTop: "20px",
                        }}
                    >
                        <label
                            style={labelStyle}
                        >
                            Address
                        </label>

                        <textarea
                            rows={4}
                            value={form.address}
                            onChange={(event) =>
                                updateField(
                                    "address",
                                    event.target
                                        .value
                                )
                            }
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: "10px",
                            marginTop: "30px",
                            paddingTop: "22px",
                            borderTop:
                                "1px solid #e5e7eb",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/admin/youth"
                                )
                            }
                            style={{
                                padding:
                                    "11px 18px",
                                borderRadius:
                                    "8px",
                                border:
                                    "1px solid #dbe3ea",
                                background:
                                    "#ffffff",
                                color:
                                    "#334155",
                                fontWeight: 600,
                                cursor:
                                    "pointer",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding:
                                    "11px 20px",
                                borderRadius:
                                    "8px",
                                border: "none",
                                background: saving
                                    ? "#86a98f"
                                    : "#166534",
                                color:
                                    "#ffffff",
                                fontWeight: 700,
                                cursor: saving
                                    ? "not-allowed"
                                    : "pointer",
                            }}
                        >
                            {saving
                                ? "Creating..."
                                : "Add Youth"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

function FormField({
    label,
    value,
    type = "text",
    required = false,
    onChange,
}: {
    label: string;
    value: string;
    type?: string;
    required?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label style={labelStyle}>
                {label}

                {required && (
                    <span
                        style={{
                            color: "#dc2626",
                            marginLeft: "3px",
                        }}
                    >
                        *
                    </span>
                )}
            </label>

            <input
                type={type}
                required={required}
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                style={inputStyle}
            />
        </div>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
};

const inputStyle = {
    display: "block",
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "11px 12px",
    border: "1px solid #dbe3ea",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#172033",
    fontSize: "14px",
    outline: "none",
};