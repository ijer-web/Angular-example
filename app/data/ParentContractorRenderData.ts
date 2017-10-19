import {ParentContractorInfo} from "./ParentContractorInfo";
import {TradesmanGridRowBg} from "../subcontractors-grid/SubContractorRenderData";
import {DatePipe} from "@angular/common";
import {AfterViewInit} from "@angular/core";
import {Utils} from "../../utils/Utils";

export enum ParentContractorStatus {
    NoResponse = 0,
    Accepted = 1
}

export class ParentContractorRenderData{

    text: string = 'text';
    subText: string = 'subText';
    public status: ParentContractorStatus = ParentContractorStatus.NoResponse;

    rowBg: TradesmanGridRowBg;

    constructor(private person: ParentContractorInfo) {

        this.status = (person.parentContractorId) ? ParentContractorStatus.Accepted:ParentContractorStatus.NoResponse;

        switch (this.status) {
            case ParentContractorStatus.NoResponse:
                this.text = "Invitation to Connect Received";
                this.subText = `Invitation Received ${this._formattedStatusDate()}`;
                break;

            case ParentContractorStatus.Accepted:
                this.text = "Invitation Accepted";
                this.subText = `Connected ${this._formattedStatusDate()}`;
                break;
        }
    }

    private _formattedStatusDate() {
        return this.person.statusDate ? `${Utils.datePipe().transform(this.person.statusDate, 'MMM dd, yyyy')}` : '';
    }
}