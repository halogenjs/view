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
									text : "Inputs (inc. checkbox)"
								}
							},
							{
								input : {
									type : "text",
									name : "text-input",
									value : "I am some text",
									required : "required",
									placeholder : ""
								}
							},
							{
								input : {
									type : "checkbox",
									checked : "checked",
									name : "checkbox-input",
									value : "checked-1"
								}
							},
							{
								input : {
									type : "checkbox",
									name : "checkbox-input",
									value : "checked-2"
								}
							},
							{
								input : {
									type : "checkbox",
									name : "checkbox-input",
									value : "checked-3"
								}
							},
							{
								input : {
									type : "radio",
									name : "radio-input",
									value : "radio-1",
									checked : "checked"
								}
							},
							{
								input : {
									type : "radio",
									name : "radio-input",
									value : "radio-2"
								}
							}
						]
					},
					{
						fieldset : [
							{
								legend : {
									innerText : "Text area and labels"
								},
							},
							{

								label : {
									"for" : "textarea-input-1",
									text : "Text input"
								},
							},
							{
								textarea : {
									name : "textarea-input-1",
									text : "a lot of text goes here"
								},
							},
							{
								label : {
									"for" : "textarea-input-2",
									innerText : "Text input"
								},
							},
							{
								textarea : {
									name : "textarea-input-2",
									innerText : "a lot of text goes here"
								},
							},
							{
								label : {
									"for" : "textarea-input-3",
									value : "Text input"
								},
							},
							{
								textarea : {
									name : "textarea-input-3",
									value : "a lot of text goes here"
								}
							}
						]
					},
					{
						select : {
							name : "select-input",
							value : "1",
							options : [
								{
									optgroup : {
										label : "Options group 1",
										options : [
											{
												option : {
													text : "option 1",
													value : "1",
												},
											},
											{
												option : {
													text : "option 2",
													value : "2"
												}
											}
										]
									},
								},
								{
									option : {
										text : "option 3",
										value : "3"
									}
								},
								{
									option : {
										text : "option 4",
										value : "4"
									}
								},
							]
						}
					},
					{
						select : {
							name : "select-multiple-input",
							multiple : "multiple",
							options : [
								{
									optgroup : {
										label : "Options group 1",
										options : [
											{
												option : {
													text : "option 1",
													value : "1",
												},
											},
											{
												option : {
													text : "option 2",
													value : "2",
													selected : "selected"
												}
											}
										]
									}
								},
								{
									option : {
										text : "option 3",
										value : "3"
									}

								},
								{
									option : {
										text : "option 4",
										value : "4"
									}
								}
							]
						}
					},
					{
						button : {
							name : "a-button",
							text : "A button!",
							type : "submit"
						}
					},
					{
						fieldset : [
							{
								legend : {
									text : "Data list"
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
									options : [
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
										},
									]
								}
							}
						]
					},
					{
						keygen : {
							name : "keygen-test"
						}
					},
					{
						output : {
							name : "output-test",
							"for" : "keygen-test"
						}
					}
				]
			}
		}
	}
};