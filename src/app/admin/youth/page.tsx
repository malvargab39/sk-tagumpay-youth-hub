"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Youth = {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    birthDate: string | null;
    sex: string | null;
    address: string | null;
    phoneNumber: string | null;
    user: {
        id: number;
        email: string;
        status: string;
    };
};

export default function YouthManagementPage() {
    const [youth, setYouth] = useState<Youth[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedYouth, setSelectedYouth] =
        useState<Youth | null>(null);

    useEffect(() => {
        loadYouth();
    }, []);

    async function loadYouth() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/youth");

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Unable to load youth records."
                );
                return;
            }

            let records: Youth[] = [];

            if (Array.isArray(data)) {
                records = data;
            } else if (Array.isArray(data.youth)) {
                records = data.youth;
            } else if (Array.isArray(data.youths)) {
                records = data.youths;
            }

            setYouth(records);
        } catch (error) {
            console.error(
                "Load youth records error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    function getFullName(person: Youth) {
        return [
            person.firstName,
            person.middleName,
            person.lastName,
        ]
            .filter(Boolean)
            .join(" ");
    }

    function formatDate(date: string | null) {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    }

    return (
        <main>
            {/* Page Header */}
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
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
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
                        Youth Management
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                        }}
                    >
                        View and manage registered youth
                        members.
                    </p>
                </div>

                <Link
                    href="/admin/youth/new"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "11px 18px",
                        borderRadius: "8px",
                        background: "#166534",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                    }}
                >
                    + Add Youth
                </Link>
            </section>

            {/* Error */}
            {error && (
                <div
                    style={{
                        padding: "14px 16px",
                        marginBottom: "20px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        color: "#b91c1c",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Youth Records */}
            <section
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow:
                        "0 2px 10px rgba(15, 23, 42, 0.04)",
                }}
            >
                <div
                    style={{
                        padding: "22px",
                        borderBottom:
                            "1px solid #e5e7eb",
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 5px",
                            fontSize: "20px",
                            color: "#172033",
                        }}
                    >
                        Youth Records
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#64748b",
                        }}
                    >
                        {youth.length} registered youth
                        member
                        {youth.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {loading ? (
                    <div
                        style={{
                            padding: "40px 22px",
                            textAlign: "center",
                            color: "#64748b",
                        }}
                    >
                        Loading youth records...
                    </div>
                ) : youth.length === 0 ? (
                    <div
                        style={{
                            padding: "40px 22px",
                            textAlign: "center",
                            color: "#64748b",
                        }}
                    >
                        No youth records found.
                    </div>
                ) : (
                    <div
                        style={{
                            overflowX: "auto",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth: "850px",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        background:
                                            "#f8fafc",
                                    }}
                                >
                                    <th
                                        style={tableHeaderStyle}
                                    >
                                        Name
                                    </th>

                                    <th
                                        style={tableHeaderStyle}
                                    >
                                        Email
                                    </th>

                                    <th
                                        style={tableHeaderStyle}
                                    >
                                        Sex
                                    </th>

                                    <th
                                        style={tableHeaderStyle}
                                    >
                                        Phone
                                    </th>

                                    <th
                                        style={tableHeaderStyle}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            ...tableHeaderStyle,
                                            width: "180px",
                                        }}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {youth.map((person) => (
                                    <tr
                                        key={person.id}
                                        style={{
                                            borderTop:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        <td
                                            style={
                                                tableCellStyle
                                            }
                                        >
                                            <strong
                                                style={{
                                                    color: "#172033",
                                                }}
                                            >
                                                {getFullName(
                                                    person
                                                )}
                                            </strong>
                                        </td>

                                        <td
                                            style={
                                                tableCellStyle
                                            }
                                        >
                                            {person.user
                                                ?.email ||
                                                "—"}
                                        </td>

                                        <td
                                            style={
                                                tableCellStyle
                                            }
                                        >
                                            {person.sex ||
                                                "—"}
                                        </td>

                                        <td
                                            style={
                                                tableCellStyle
                                            }
                                        >
                                            {person.phoneNumber ||
                                                "—"}
                                        </td>

                                        <td
                                            style={
                                                tableCellStyle
                                            }
                                        >
                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "5px 10px",
                                                    borderRadius:
                                                        "999px",
                                                    background:
                                                        person.user
                                                            ?.status ===
                                                            "ACTIVE"
                                                            ? "#dcfce7"
                                                            : "#f1f5f9",
                                                    color:
                                                        person.user
                                                            ?.status ===
                                                            "ACTIVE"
                                                            ? "#166534"
                                                            : "#64748b",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                {person.user
                                                    ?.status ||
                                                    "UNKNOWN"}
                                            </span>
                                        </td>

                                        <td
                                            style={
                                                tableCellStyle
                                            }
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap: "8px",
                                                }}
                                            >
                                                {/* VIEW */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedYouth(
                                                            person
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 13px",
                                                        border: "1px solid #dbe3ea",
                                                        borderRadius:
                                                            "7px",
                                                        background:
                                                            "#ffffff",
                                                        color:
                                                            "#172033",
                                                        fontWeight:
                                                            600,
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    View
                                                </button>

                                                {/* EDIT */}
                                                <Link
                                                    href={`/admin/youth/${person.id}/edit`}
                                                    style={{
                                                        display:
                                                            "inline-flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        padding:
                                                            "8px 13px",
                                                        borderRadius:
                                                            "7px",
                                                        background:
                                                            "#166534",
                                                        color:
                                                            "#ffffff",
                                                        textDecoration:
                                                            "none",
                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Modern View Modal */}
            {selectedYouth && (
                <div
                    onClick={() =>
                        setSelectedYouth(null)
                    }
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(15, 23, 42, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        style={{
                            width: "100%",
                            maxWidth: "560px",
                            background: "#ffffff",
                            borderRadius: "16px",
                            boxShadow:
                                "0 20px 50px rgba(15, 23, 42, 0.2)",
                            overflow: "hidden",
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                padding: "22px 24px",
                                borderBottom:
                                    "1px solid #e5e7eb",
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "flex-start",
                                gap: "20px",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin: "0 0 5px",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#166534",
                                        textTransform:
                                            "uppercase",
                                        letterSpacing:
                                            "0.06em",
                                    }}
                                >
                                    Youth Profile
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "22px",
                                        color: "#172033",
                                    }}
                                >
                                    {getFullName(
                                        selectedYouth
                                    )}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedYouth(null)
                                }
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background:
                                        "#f1f5f9",
                                    color: "#475569",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div
                            style={{
                                padding: "24px",
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: "20px",
                            }}
                        >
                            <InfoItem
                                label="Email"
                                value={
                                    selectedYouth.user
                                        ?.email ||
                                    "Not provided"
                                }
                            />

                            <InfoItem
                                label="Status"
                                value={
                                    selectedYouth.user
                                        ?.status ||
                                    "Unknown"
                                }
                            />

                            <InfoItem
                                label="Sex"
                                value={
                                    selectedYouth.sex ||
                                    "Not provided"
                                }
                            />

                            <InfoItem
                                label="Birth Date"
                                value={formatDate(
                                    selectedYouth.birthDate
                                )}
                            />

                            <InfoItem
                                label="Phone Number"
                                value={
                                    selectedYouth.phoneNumber ||
                                    "Not provided"
                                }
                            />

                            <InfoItem
                                label="Youth ID"
                                value={String(
                                    selectedYouth.id
                                )}
                            />

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1",
                                }}
                            >
                                <InfoItem
                                    label="Address"
                                    value={
                                        selectedYouth.address ||
                                        "Not provided"
                                    }
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div
                            style={{
                                padding: "18px 24px",
                                borderTop:
                                    "1px solid #e5e7eb",
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                gap: "10px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedYouth(null)
                                }
                                style={{
                                    padding:
                                        "10px 16px",
                                    border: "1px solid #dbe3ea",
                                    borderRadius: "8px",
                                    background:
                                        "#ffffff",
                                    color: "#172033",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Close
                            </button>

                            <Link
                                href={`/admin/youth/${selectedYouth.id}`}
                                style={{
                                    padding:
                                        "10px 16px",
                                    borderRadius: "8px",
                                    background:
                                        "#166534",
                                    color:
                                        "#ffffff",
                                    textDecoration:
                                        "none",
                                    fontWeight: 600,
                                }}
                            >
                                Edit Youth
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <div
                style={{
                    marginBottom: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: "14px",
                    color: "#172033",
                    lineHeight: 1.5,
                }}
            >
                {value}
            </div>
        </div>
    );
}

const tableHeaderStyle = {
    padding: "14px 12px",
    textAlign: "left" as const,
    fontSize: "13px",
    fontWeight: 700,
    color: "#475569",
    whiteSpace: "nowrap" as const,
};

const tableCellStyle = {
    padding: "14px 12px",
    fontSize: "14px",
    color: "#475569",
    verticalAlign: "middle" as const,
};