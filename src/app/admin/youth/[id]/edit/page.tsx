"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

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

type FormState = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    birthDate: string;
    sex: string;
    address: string;
    phoneNumber: string;
    status: string;
};

export default function EditYouthPage() {
    const params = useParams();
    const router = useRouter();

    const youthId = String(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState<FormState>({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        birthDate: "",
        sex: "",
        address: "",
        phoneNumber: "",
        status: "",
    });

    useEffect(() => {
        async function loadYouth() {
            try {
                setLoading(true);
                setError("");
                setSuccess("");

                const response = await fetch(
                    `/api/youth/${youthId}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.error ||
                        "Unable to load youth record."
                    );
                    return;
                }

                const person: Youth = data.youth;

                if (!person) {
                    setError(
                        "Youth record not found."
                    );
                    return;
                }

                setForm({
                    firstName:
                        person.firstName || "",
                    middleName:
                        person.middleName || "",
                    lastName:
                        person.lastName || "",
                    email:
                        person.user?.email || "",
                    birthDate: person.birthDate
                        ? person.birthDate.substring(
                            0,
                            10
                        )
                        : "",
                    sex: person.sex || "",
                    address:
                        person.address || "",
                    phoneNumber:
                        person.phoneNumber || "",
                    status:
                        person.user?.status ||
                        "UNKNOWN",
                });
            } catch (err) {
                console.error(
                    "Load youth error:",
                    err
                );

                setError(
                    "Unable to connect to the server."
                );
            } finally {
                setLoading(false);
            }
        }

        if (youthId) {
            loadYouth();
        }
    }, [youthId]);

    function updateField(
        field: keyof FormState,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (saving) {
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `/api/youth/${youthId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        firstName:
                            form.firstName.trim(),

                        middleName:
                            form.middleName.trim() ||
                            null,

                        lastName:
                            form.lastName.trim(),

                        birthDate:
                            form.birthDate ||
                            null,

                        sex:
                            form.sex ||
                            null,

                        address:
                            form.address.trim() ||
                            null,

                        phoneNumber:
                            form.phoneNumber.trim() ||
                            null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Unable to update youth record."
                );
                return;
            }

            setSuccess(
                "Youth record updated successfully."
            );
        } catch (err) {
            console.error(
                "Update youth error:",
                err
            );

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleBack() {
        router.push("/admin/youth");
    }

    if (loading) {
        return (
            <main style={pageStyle}>
                <div style={loadingCardStyle}>
                    <div style={spinnerStyle} />

                    <p
                        style={{
                            margin: "16px 0 0",
                            color: "#64748b",
                            fontSize: "14px",
                        }}
                    >
                        Loading youth record...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main style={pageStyle}>
            {/* Page Header */}
            <section style={headerStyle}>
                <div>
                    <div style={breadcrumbStyle}>
                        <button
                            type="button"
                            onClick={handleBack}
                            style={
                                breadcrumbButtonStyle
                            }
                        >
                            Youth Management
                        </button>

                        <span
                            style={{
                                color: "#94a3b8",
                            }}
                        >
                            /
                        </span>

                        <span>
                            Edit Youth
                        </span>
                    </div>

                    <h1 style={titleStyle}>
                        Edit Youth
                    </h1>

                    <p style={subtitleStyle}>
                        Update the registered youth
                        member&apos;s information.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleBack}
                    style={backButtonStyle}
                >
                    <span
                        style={{
                            fontSize: "18px",
                            lineHeight: 1,
                        }}
                    >
                        ←
                    </span>

                    Back to Youth
                </button>
            </section>

            {/* Success Message */}
            {success && (
                <div style={successStyle}>
                    <div
                        style={
                            successIconStyle
                        }
                    >
                        ✓
                    </div>

                    <div>
                        <strong
                            style={{
                                display:
                                    "block",
                                marginBottom:
                                    "2px",
                            }}
                        >
                            Changes saved
                        </strong>

                        <span>
                            {success}
                        </span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={errorStyle}>
                    <div
                        style={
                            errorIconStyle
                        }
                    >
                        !
                    </div>

                    <div>
                        <strong
                            style={{
                                display:
                                    "block",
                                marginBottom:
                                    "2px",
                            }}
                        >
                            Something went wrong
                        </strong>

                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <section style={cardStyle}>
                {/* Card Header */}
                <div style={cardHeaderStyle}>
                    <div>
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Personal Information
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Update the personal details
                            of this registered youth
                            member.
                        </p>
                    </div>

                    <StatusBadge
                        status={form.status}
                    />
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={formStyle}
                >
                    {/* Name Section */}
                    <div style={formSectionStyle}>
                        <div
                            style={
                                formSectionHeaderStyle
                            }
                        >
                            <div
                                style={
                                    sectionNumberStyle
                                }
                            >
                                1
                            </div>

                            <div>
                                <h3
                                    style={
                                        formSectionTitleStyle
                                    }
                                >
                                    Name
                                </h3>

                                <p
                                    style={
                                        formSectionTextStyle
                                    }
                                >
                                    Enter the youth
                                    member&apos;s
                                    complete name.
                                </p>
                            </div>
                        </div>

                        <div
                            style={
                                threeColumnGridStyle
                            }
                        >
                            <FormField
                                label="First Name"
                                required
                            >
                                <input
                                    type="text"
                                    required
                                    value={
                                        form.firstName
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "firstName",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                    autoComplete="given-name"
                                />
                            </FormField>

                            <FormField label="Middle Name">
                                <input
                                    type="text"
                                    value={
                                        form.middleName
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "middleName",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                    autoComplete="additional-name"
                                />
                            </FormField>

                            <FormField
                                label="Last Name"
                                required
                            >
                                <input
                                    type="text"
                                    required
                                    value={
                                        form.lastName
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "lastName",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                    autoComplete="family-name"
                                />
                            </FormField>
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* Personal Details */}
                    <div style={formSectionStyle}>
                        <div
                            style={
                                formSectionHeaderStyle
                            }
                        >
                            <div
                                style={
                                    sectionNumberStyle
                                }
                            >
                                2
                            </div>

                            <div>
                                <h3
                                    style={
                                        formSectionTitleStyle
                                    }
                                >
                                    Personal Details
                                </h3>

                                <p
                                    style={
                                        formSectionTextStyle
                                    }
                                >
                                    Update the
                                    member&apos;s
                                    basic personal
                                    information.
                                </p>
                            </div>
                        </div>

                        <div
                            style={
                                threeColumnGridStyle
                            }
                        >
                            <FormField label="Birth Date">
                                <input
                                    type="date"
                                    value={
                                        form.birthDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "birthDate",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                />
                            </FormField>

                            <FormField label="Sex">
                                <select
                                    value={
                                        form.sex
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "sex",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                >
                                    <option value="">
                                        Select sex
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>
                                </select>
                            </FormField>

                            <FormField label="Phone Number">
                                <input
                                    type="tel"
                                    value={
                                        form.phoneNumber
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "phoneNumber",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                    autoComplete="tel"
                                    placeholder="09XXXXXXXXX"
                                />
                            </FormField>
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* Account Information */}
                    <div style={formSectionStyle}>
                        <div
                            style={
                                formSectionHeaderStyle
                            }
                        >
                            <div
                                style={
                                    sectionNumberStyle
                                }
                            >
                                3
                            </div>

                            <div>
                                <h3
                                    style={
                                        formSectionTitleStyle
                                    }
                                >
                                    Account Information
                                </h3>

                                <p
                                    style={
                                        formSectionTextStyle
                                    }
                                >
                                    Account information
                                    connected to this
                                    youth record.
                                </p>
                            </div>
                        </div>

                        <FormField label="Email Address">
                            <input
                                type="email"
                                value={form.email}
                                disabled
                                style={{
                                    ...inputStyle,
                                    background:
                                        "#f8fafc",
                                    color:
                                        "#64748b",
                                    cursor:
                                        "not-allowed",
                                }}
                                autoComplete="email"
                            />

                            <p
                                style={
                                    helperTextStyle
                                }
                            >
                                Email is managed by
                                the user account and
                                cannot be changed here.
                            </p>
                        </FormField>
                    </div>

                    <div style={dividerStyle} />

                    {/* Address */}
                    <div style={formSectionStyle}>
                        <div
                            style={
                                formSectionHeaderStyle
                            }
                        >
                            <div
                                style={
                                    sectionNumberStyle
                                }
                            >
                                4
                            </div>

                            <div>
                                <h3
                                    style={
                                        formSectionTitleStyle
                                    }
                                >
                                    Address
                                </h3>

                                <p
                                    style={
                                        formSectionTextStyle
                                    }
                                >
                                    Update the current
                                    residential address.
                                </p>
                            </div>
                        </div>

                        <FormField label="Complete Address">
                            <textarea
                                rows={4}
                                value={form.address}
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "address",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                style={{
                                    ...inputStyle,
                                    resize:
                                        "vertical",
                                    minHeight:
                                        "110px",
                                    lineHeight: 1.5,
                                }}
                                placeholder="Enter complete address"
                            />
                        </FormField>
                    </div>

                    {/* Bottom Actions */}
                    <div
                        style={
                            actionContainerStyle
                        }
                    >
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={saving}
                            style={{
                                ...cancelButtonStyle,
                                opacity: saving
                                    ? 0.6
                                    : 1,
                                cursor: saving
                                    ? "not-allowed"
                                    : "pointer",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                ...saveButtonStyle,
                                opacity: saving
                                    ? 0.7
                                    : 1,
                                cursor: saving
                                    ? "not-allowed"
                                    : "pointer",
                            }}
                        >
                            {saving ? (
                                <>
                                    <span
                                        style={
                                            buttonSpinnerStyle
                                        }
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span
                                        style={{
                                            fontSize:
                                                "16px",
                                        }}
                                    >
                                        ✓
                                    </span>

                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

function FormField({
    label,
    required = false,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div style={fieldStyle}>
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

            {children}
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const normalizedStatus =
        status.toUpperCase();

    const isActive =
        normalizedStatus === "ACTIVE";

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 11px",
                borderRadius: "999px",
                background: isActive
                    ? "#dcfce7"
                    : "#f1f5f9",
                color: isActive
                    ? "#166534"
                    : "#64748b",
                fontSize: "12px",
                fontWeight: 700,
                whiteSpace: "nowrap",
            }}
        >
            <span
                style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: isActive
                        ? "#16a34a"
                        : "#94a3b8",
                }}
            />

            {normalizedStatus || "UNKNOWN"}
        </div>
    );
}

/* =========================
   PAGE STYLES
========================= */

const pageStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "10px 0 50px",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
    flexWrap: "wrap" as const,
    marginBottom: "28px",
};

const breadcrumbStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    color: "#64748b",
    fontSize: "12px",
};

const breadcrumbButtonStyle = {
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#166534",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
};

const titleStyle = {
    margin: "0 0 7px",
    fontSize: "32px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#172033",
};

const subtitleStyle = {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
};

const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 15px",
    border: "1px solid #dbe3ea",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
};

const loadingCardStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "220px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    boxShadow:
        "0 2px 8px rgba(15, 23, 42, 0.04)",
};

const spinnerStyle = {
    width: "28px",
    height: "28px",
    border: "3px solid #dcfce7",
    borderTop: "3px solid #166534",
    borderRadius: "50%",
};

const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    boxShadow:
        "0 3px 12px rgba(15, 23, 42, 0.045)",
    overflow: "hidden",
};

const cardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap" as const,
    padding: "22px 26px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
};

const sectionTitleStyle = {
    margin: "0 0 5px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#172033",
};

const sectionDescriptionStyle = {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
};

const formStyle = {
    padding: "28px 26px",
};

const formSectionStyle = {
    marginBottom: "4px",
};

const formSectionHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "20px",
};

const sectionNumberStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f0fdf4",
    color: "#166534",
    fontSize: "12px",
    fontWeight: 700,
};

const formSectionTitleStyle = {
    margin: "1px 0 3px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#172033",
};

const formSectionTextStyle = {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
};

const threeColumnGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
};

const fieldStyle = {
    marginBottom: "18px",
};

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

const helperTextStyle = {
    margin: "7px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
};

const dividerStyle = {
    height: "1px",
    background: "#e5e7eb",
    margin: "25px 0",
};

const actionContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    marginTop: "28px",
    paddingTop: "22px",
    borderTop: "1px solid #e5e7eb",
};

const cancelButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "90px",
    padding: "11px 18px",
    borderRadius: "8px",
    border: "1px solid #dbe3ea",
    background: "#ffffff",
    color: "#475569",
    fontSize: "13px",
    fontWeight: 600,
};

const saveButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "135px",
    padding: "11px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#166534",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
};

const successStyle = {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px 15px",
    marginBottom: "20px",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    background: "#f0fdf4",
    color: "#166534",
    fontSize: "13px",
};

const successIconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: 800,
};

const errorStyle = {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px 15px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "13px",
};

const errorIconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: 800,
};

const buttonSpinnerStyle = {
    width: "12px",
    height: "12px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
};