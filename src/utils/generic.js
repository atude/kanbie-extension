export const labelRegex = /@\[([^\]]*)\]\(([^)]*)\)/g;
export const maxItems = 10;

// Remove labels/times and white space
export const filterString = (txt) => 
	txt
		.replace(/\s/g, "")
		.replace(/@\[([^\]]*)\]\(([^)]*)\)/g, "");


export const filterStringIncludeSpace = (txt) => txt.replace(/@\[([^\]]*)\]\(([^)]*)\)/g, "");
