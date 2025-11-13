# EduChain

**Decentralized Student Credential Wallet on Polkadot**

Own your credentials. Verify instantly. Trustlessly.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution — What EduChain Does](#solution)
4. [Key Features](#key-features)
5. [Technical Architecture](#technical-architecture)
6. [Tech Stack & Tools Used](#tech-stack--tools-used)
7. [How to Use / Demo Flow](#how-to-use--demo-flow)
8. [Security, Privacy & Data Model](#security-privacy--data-model)
9. [Testing & Evaluation](#testing--evaluation)
10. [Limitations & Future Work](#limitations--future-work)
11. [How This Project Solves the Problem](#how-this-project-solves-the-problem)
12. [Contributors](#contributors)

---

## Project Overview

EduChain is a decentralized credential wallet and verification system built on the Polkadot ecosystem. It enables educational institutions to issue tamper-proof credentials (degrees, certificates, transcripts) onto a blockchain, and allows students to hold, present, and share verifiable credentials without relying on slow, manual verification processes.

This repository contains the code and documentation created for the Polkadot Hackathon entry.

---

## Problem Statement

Traditional credential verification is:

* Slow and manual (phone or email checks, PDFs that can be forged),
* Costly and error-prone for employers and institutions,
* Hard for applicants to carry verifiable proof across borders or platforms.

Stakeholders affected: students/alumni, universities, employers, licensing bodies.

---

## Solution

EduChain provides a user-centric credential wallet where institutions mint signed credentials as verifiable claims recorded (or anchored) on a Polkadot-compatible substrate chain. Holders control sharing, and verifiers can check authenticity and issuance metadata quickly through on-chain proofs and cryptographic signatures.

Key outcomes:

* Instant, cryptographically verifiable credentials,
* Reduced verification overhead for employers/universities,
* User ownership and portability of academic records.

---

## Key Features

* **Issuer Dashboard**: Issue and sign credentials for students.
* **Holder Wallet**: Students import and manage their credentials.
* **Verifier Interface**: Accept proof requests and verify credentials in real-time.
* **On-chain Anchoring**: Anchors credential hashes and issuance metadata on a Substrate/Polkadot-compatible network.
* **Role-based Access Control**: Issuers, holders, and verifiers each have clear workflows.
* **Export/Share**: Generate shareable verifiable presentations for employers.

---

## Technical Architecture

* **Front-end**: Web UI for Issuers, Holders, and Verifiers. (React-based single page app — see `frontend/`)
* **Back-end / API**: Node.js service that handles off-chain credential storage (encrypted), DID management, and bridges to the chain. (See `backend/`)
* **Blockchain Layer**: Substrate-based runtime or use of a Polkadot parachain to anchor credential proofs/hashes and record minimal issuance metadata.
* **Cryptography**: Each issued credential is signed by the Issuer's private key. The credential hash and issuance ID are anchored on-chain for tamper-evidence.
* **Data Flow**:

  1. Issuer creates credential (JSON-LD / verifiable credential format).
  2. Credential is signed and stored off-chain (encrypted) with a hash computed.
  3. Hash and issuance metadata are anchored on-chain with a transaction.
  4. Holder receives credential and can present it; Verifier checks the signature and confirms the anchored hash on-chain.

(See `architecture/` for diagrams and more detail.)

---

## Tech Stack & Tools Used

* **Blockchain / Smart Contracts**: Substrate (Polkadot ecosystem) — runtime modules or pallets for anchoring credential metadata.
* **Frontend**: React (Vite / Create React App) — issuer/holder/verifier UI.
* **Backend**: Node.js + Express / NestJS (API for DID management, credential issuance, and storage bridge).
* **Database / Storage**: Encrypted document store (e.g., MongoDB or IPFS for large objects + pointer in DB).
* **Identity / Standards**: DIDs (Decentralized Identifiers), W3C Verifiable Credentials (VC) / Presentations.
* **Crypto**: Ed25519 / ECDSA keys for signing credentials.
* **Dev Tools**: Polkadot JS tools, Substrate node (local testnet).
* **Languages**: JavaScript / TypeScript, Rust (for Substrate pallets if applicable).

---

## How to Use / Demo Flow

1. **Register Issuer**: Create an Issuer account on the issuer dashboard and register the organization DID.
2. **Issue Credential**: Fill student name, program, date, and certificate attributes. Issue — the system signs and anchors the credential.
3. **Receive Credential**: Student (Holder) logs into their wallet and imports the issued credential.
4. **Share with Verifier**: Holder generates a verifiable presentation or share URL. Verifier scans/requests proof and the app verifies the signature and on-chain anchor.

---

## Security, Privacy & Data Model

* **Private Data Off-chain**: Personal data or full credentials are stored off-chain in encrypted form; only hashes and minimal metadata are anchored on-chain.
* **User Consent**: Holders explicitly control sharing of credentials (presentations) and can revoke or rotate keys if needed.
* **Key Management**: Issuers manage keys securely; consider hardware security modules (HSM) in production.
* **Revocation**: Revocation can be implemented using a lightweight on-chain revocation list or status registry.

---

## Testing & Evaluation

* Unit tests for backend API and frontend components (`npm test` where configured).
* Integration tests around issuance → anchor → verification flow using test accounts and local Substrate node.
* Manual end-to-end demonstration that issues a credential, anchors its hash, and verifies it through the verifier UI.

---

## Limitations & Future Work

* **Scalability**: Current demo anchors simple hashes; a production system should consider batching anchors or using scalable rollups.
* **Privacy Enhancements**: Support for selective disclosure / zero-knowledge proofs (to reveal only required attributes).
* **Cross-chain Interop**: Extend support to other chains or identity networks.
* **Mobile Wallet**: Create a mobile app for easier holder experience.

---

## How This Project Solves the Problem

EduChain reduces time and cost for credential verification by providing cryptographic proof of issuance and an immutable, publicly verifiable anchor on a Polkadot-compatible ledger. Employers and verifiers can confirm the credential's authenticity without contacting the issuing institution every time.

---

## Contributors

* **Arsema Seife** — Project Lead (Repository owner)

