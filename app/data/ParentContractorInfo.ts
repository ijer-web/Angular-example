import {ParentContractorRenderData} from "./ParentContractorRenderData";


export class ParentContractorInfo {
    public parentContractorId: number = 0;
    public invitationKey: number = 0;
    public name: string = '';
    public email: string = '';
    public statusDate:string = '';

    private _renderData: ParentContractorRenderData = null;

    public isSelected:boolean = false;

    _resetRenderData() {
        this._renderData = null;
        this.isSelected = false;
    }

    getRenderData(): ParentContractorRenderData {
        if (!this._renderData)
            this._renderData = new ParentContractorRenderData(this);

        return this._renderData;
    }


}