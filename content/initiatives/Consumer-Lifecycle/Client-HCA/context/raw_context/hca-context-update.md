# HCA Context Update — January 2025

## Agreement Types for Recipients

A recipient (package holder) can have four distinct types of agreements:

1. **HCA (Home Care Agreement)** — The foundational agreement
2. **Variations** — Amendments to the HCA (e.g. Change of Option Variation)
3. **TPCs (Third-Party Contracts)** — Direct agreements between clients and suppliers
4. **Funding Stream Agreements** — e.g. ATHM Restorative Care

Each of these is its own distinct object. Variations, for example, have their own body and require their own signature — they're separate from the HCA itself.

---

## Home Care Agreement (HCA)

The HCA is the agreement clients sign when they first start with Trilogy Care.

**Key variables include:**

- **Option** — e.g. Self-Managed (SM) or Self-Management Plus (SM+)
- **Commencement Date** — This is critical because it's used for ACER lodgement, among other things

**Important:** The HCA's existence and status is inextricably linked to the ACER. If a client is terminated, it means they've left Trilogy. When updating an HCA, the original agreement isn't replaced — the original data object remains intact.

**Signature handling:** There's a substitute decision maker field for situations where the normal signee can't sign. The workflow would allow the user to select "signing with an authorised decision maker," which changes the nature of the signature and captures who is actually signing on behalf of the client.

---

## Variations

Variations are amendments to the original HCA. They share the same field structure as the HCA.

**Example: Change of Option Variation**

When a client switches between Self-Managed and Self-Management Plus, this triggers a variation. The practical impact is on fees:

- **SM → SM+:** Coordinator loadings apply
- **SM+ → SM:** Regular Trilogy Care loadings apply

---

## TPC (Third-Party Contract) and APA

**Standard process (APA):**

In the normal course, suppliers onboard and engage directly with Trilogy Care. The APA (Agreement) defines the relationship, pricing, and ties together the supplier's listed rates. Trilogy Care is the signing party alongside the supplier. This covers the vast majority of supplier relationships.

**Exception process (TPC):**

In certain conditions, Trilogy Care facilitates a direct agreement between the client and the supplier, rather than contracting with the supplier themselves. These conditions are identified during supplier onboarding and, when triggered, the supplier is directed to a different agreement type.

The TPC requires the client's signature. Trilogy Care is not a party to the contract but facilitates it on the client's behalf. The underlying agreement text is largely the same as the APA — the key difference is who the contracting parties are.

| | **APA** | **TPC** |
|---|---|---|
| Signing parties | Trilogy Care ↔ Supplier | Client ↔ Supplier |
| Trilogy's role | Contracting party | Facilitator only |
| Triggered by | Default supplier onboarding | Specific conditions at onboarding |
