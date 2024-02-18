"use client";
import React, { useCallback, useState } from "react";
import "@/styles/globals.css";
import "@/styles/text-editor.css";
import { TextEditor } from "@/components/textEditor/TextEditor";
export default function SimpleEditor() {

    return (
        <div className={'TextEditorContainer'}>
            <TextEditor/>
        </div>
    );
}
