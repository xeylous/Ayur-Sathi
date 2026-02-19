"use client";

import { useState } from "react";
import { X, Search, Copy, Check, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_DOCS = `# Ayur-Sathi API Reference

## Authentication & User Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/register | Register a new user (farmer or lab). Sends OTP for verification. |
| POST | /api/send-otp/[uniqueId] | Send OTP to user's email for verification/login. |
| POST | /api/resend-otp/[uniqueId] | Resend OTP if not received. |
| POST | /api/verify-otp/[uniqueId] | Verify user OTP and update verification status. |
| POST | /api/login | Log in user, returns JWT token in cookies (\`auth_token\`). |
| GET  | /api/logout | Log out user by clearing authentication cookies. |
| GET  | /api/verify-token | Check if stored JWT token is valid or expired. |

## Crop Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/cropUploaded | Upload new crop batch (sets status = Pending, generates barcode). |
| GET  | /api/crops/[uniqueId] | Fetch all crop uploads by a specific farmer (JWT auth required). |

## Laboratory Processing
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/labverification | Fetch crop batches assigned to lab user for testing (filter by status). |
| POST  | /api/labverification | Save crop batches which is accepted by the lab for testing. |
| POST | /api/approve | Approve/reject crop batch, upload certificate, update test results. |

## Manufacture Processing
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/manufacture | Fetch crop batches that came for manufacturing unit. |
| POST  | /api/labverification | Save crop batches which is accepted by the lab for testing. |
| POST | /api/approve | Approve/reject crop batch, upload certificate, update test results. |

## Profile Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST  | /api/profile | Fetch and Update profile information of the currently logged-in user (JWT required). |

## Partnership & Integration
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/partnership | Register new partners (labs or buyers) with company and contact info. |

## Public APIs
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/public/batch | Fetch batch details by batchId (returns base64 encoded data). |
| GET  | /api/public/batchStatus/[batchId] | Get current status of a batch. |

## Cloud & Utility APIs
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/signed-url | Generate Cloudinary signed upload URL for images/certificates. |
| POST | /api/sms-webhook | Receive SMS status updates from external SMS provider. |
| GET  | /api/user/[uniqueId] | Fetch public or internal user details (access varies by role). |
`;

export default function APIDocsModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const handleCopyEndpoint = (endpoint) => {
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const filteredDocs = API_DOCS.split("\n")
    .filter((line) =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .join("\n");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-[#31572C]">
              API Documentation
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Explore available endpoints and integration options
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#90A955]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto mb-6">
                    <table
                      className="min-w-full border border-gray-300 rounded-lg"
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="bg-[#ECF39E]/50 border border-gray-300 px-4 py-2 text-left font-semibold text-[#31572C]"
                    {...props}
                  />
                ),
                td: ({ node, children, ...props }) => {
                  const content = String(children);
                  const isEndpoint = content.startsWith("/api/");

                  return (
                    <td
                      className="border border-gray-300 px-4 py-2"
                      {...props}
                    >
                      {isEndpoint ? (
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                            {content}
                          </code>
                          <button
                            onClick={() => handleCopyEndpoint(content)}
                            className="p-1 hover:bg-gray-100 rounded transition"
                            title="Copy endpoint"
                          >
                            {copiedEndpoint === content ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Copy size={16} className="text-gray-600" />
                            )}
                          </button>
                        </div>
                      ) : (
                        children
                      )}
                    </td>
                  );
                },
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl font-bold text-[#31572C] mt-6 mb-3 pb-2 border-b border-gray-200"
                    {...props}
                  />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code
                      className="bg-gray-100 px-1.5 py-0.5 rounded text-sm"
                      {...props}
                    />
                  ) : (
                    <code className="block bg-gray-100 p-3 rounded" {...props} />
                  ),
              }}
            >
              {filteredDocs || "No results found"}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              Need help? Contact{" "}
              <a
                href="mailto:support@ayursathi.com"
                className="text-[#4F772D] hover:underline"
              >
                support@ayursathi.com
              </a>
            </p>
            <a
              href="/docs"
              className="flex items-center gap-1 text-[#4F772D] hover:underline"
            >
              Full Documentation
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
