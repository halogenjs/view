var fixtures = {
	"/everything" : {
		_links : {
			self : {
				href : "/everything"
			},
			"controls:test" : {
				href : "#_controls/test"
			}
		},
		_controls : {
			test : {
				action : "/tasklist/create",
				method : "POST",
				encoding : "application/x-www-form-urlencoded",
				properties : [
					{
						fieldset : [
							{
								legend : {
									_text : "Inputs (inc. checkbox)"
								}
							},
							{
								input : {
									type : "text",
									name : "text-input",
									value : "I am some text",
									required : "required",
									placeholder : "Some default helptext",
									_label : "Free text"
								}
							},
							{
								input : {
									type : "checkbox",
									name : "checkbox-input",
									value : "checked-1",
									_label : "Checkbox 1"
								}
							},
							{
								input : {
									type : "radio",
									name : "radio-input",
									value : "radio-1",
									checked : "checked",
									_label : "Radio 1"
								}
							}
						]
					},
					{
						fieldset : [
							{
								legend : {
									_text : "Checkboxes and radios (special)"
								}
							},
							{
								checkboxes : {
									name : "checkboxes",
									_label : "Checkbox options",
									_options : [
										{
											value : "1",
											_label : "One",
											checked : "checked"
										},
										{
											value : "2",
											_label : "Two"
										}
									]
								}
							},
							{
								radios : {
									name : "radios",
									_label : "Radio options",
									_options : [
										{
											value : "1",
											_label : "One",
											checked : "checked"
										},
										{
											value : "2",
											_label : "Two"
										}
									]
								}
							}
						]
					},
					{
						fieldset : [
							{
								legend : {
									_text : "Text area and labels"
								}
							},
							{
								textarea : {
									id : "textarea-input-1",
									name : "textarea-input-1",
									_text : "a lot of text goes here",
									_label : "Big Text input"
								}
							},
							{
								textarea : {
									id : "textarea-input-2",
									name : "textarea-input-2",
									_text : "a lot of text goes here",
									_label : "Big Text input 2"
								}
							},
							{
								textarea : {
									id : "textarea-input-3",
									name : "textarea-input-3",
									_text: "a lot of text goes here",
									_label : "Big Text input 3"
								}
							}
						]
					},
					{
						select : {
							name : "select-input",
							value : "1",
							_options : [
								{
									optgroup : {
										label : "Options group 1",
										_options : [
											{
												option : {
													_text : "option 1",
													value : "1",
												},
											},
											{
												option : {
													_text : "option 2",
													value : "2"
												}
											}
										]
									}
								},
								{
									option : {
										_text : "option 3",
										value : "3"
									}
								},
								{
									option : {
										_text : "option 4",
										value : "4"
									}
								}
							]
						}
					},
					{
						select : {
							name : "select-multiple-input",
							multiple : "multiple",
							_options : [
								{
									optgroup : {
										label : "Options group 1",
										_options : [
											{
												option : {
													_text : "option 1",
													value : "1",
												},
											},
											{
												option : {
													_text : "option 2",
													value : "2",
													selected : "selected"
												}
											}
										]
									}
								},
								{
									option : {
										_text : "option 3",
										value : "3"
									}

								},
								{
									option : {
										_text : "option 4",
										value : "4"
									}
								}
							]
						}
					},
					{
						button : {
							name : "a-button",
							_text : "A button!",
							type : "submit"
						}
					},
					{
						fieldset : [
							{
								legend : {
									_text : "Data list"
								}
							},
							{
								input : {
									list : "browsers"
								}
							},
							{
								datalist : {
									id : "browsers",
									_options : [
										{
											option : {
												value : "Internet Explorer"
											}
										},
										{
											option : {
												value : "Mozilla Firefox"
											}
										},
										{
											option : {
												value : "Google Chrome"
											}
										}
									]
								}
							}
						]
					},
					{
						fieldset : [
							{
								legend : {
									_text : "Output"
								}
							},
							{
								output : {
									name : "output-test",
									value : "Hello"
								}
							}
						]
					}
				]
			}
		}
	} /*,
	"/eventtest" : {
		_links : {
			self : {
				href : "/eventtest"
			},
			"controls:test" : {
				href : '#_controls/test'
			}
		},
		_controls : {

			test : {
				method : "POST",
				action : "/eventtest/form",
				encoding : "application/x-www-form-urlencoded",
				properties : [
					{
						fieldset : [
							{
								legend : {
									label : "Inputs"
								}
							},
							{
								checkboxes : {
									_label : "checkboxes",
									_options : [
										{
											input : {
												type : "checkbox",
												checked : "checked",
												value : ""
											}											
										},
										{
											input : {


											}											
										}
									]
								}								
							}
						]
					}
				]

			}

		}

	}
	*/
};