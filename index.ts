import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ButtonControl, { IButtonProps } from "./ButtonControl";

export class CustomizeButtonForForm implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _notifyOutputChanged: () => void;
	private _currentValue: string | null;
	private _actionText: string;
	private _iconForButton: string;
	private _isPrimary: boolean;


	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;

		this._actionText = context.parameters.ActionText.raw ?? "";

		if (this._actionText.trim().startsWith("{")) {
			let json = JSON.parse(this._actionText);
			try {
				this._actionText = json[context.userSettings.languageId];
				if (this._actionText === undefined) {
					this._actionText = json[parseInt(Object.keys(json)[0])];
				}
			}
			catch {
				this._actionText = json[parseInt(Object.keys(json)[0])];
			}
		}

		this._iconForButton = context.parameters.IconName.raw ?? "";

		this._isPrimary=  context.parameters.IsPrimary.raw == "YES"? true: false;


		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>): void {

		let props: IButtonProps = {
			text: this._actionText,
			disabled: false, //context.parameters.SetAsFormState.raw === "True" ? context.mode.isControlDisabled : false,
			icon: this._iconForButton,
			primary: this._isPrimary,
			onClick: () => {
				this._notifyOutputChanged();
			}
		};

		ReactDOM.render(React.createElement(ButtonControl, props), this._container);
		
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.renderControl(context);

		this._currentValue = context.parameters.BoundAttribute.raw ?? "";
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			BoundAttribute: this._actionText
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}